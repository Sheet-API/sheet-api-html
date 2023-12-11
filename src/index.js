/* eslint-disable no-param-reassign */
const getForms = () => {
  const markedForms = document.querySelectorAll('form[action^="https://api.sheetapi.rest/"]');
  return [...markedForms].filter((form) => !form.getAttribute('data-sheet-api-processed'));
};

const execInElement = (container, selector, func) => {
  [...container.querySelectorAll(selector)].forEach(func);
};

const processForm = (form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formAction = form.getAttribute('action');
    const loadingMessage = form.getAttribute('data-loading-msg') || 'Loading...';

    const successMessage = form.getAttribute('data-success-msg') || 'Your submission was received!';

    const errorMessage = form.getAttribute('data-error-msg') || 'Your submission has failed, please try again later';

    const inputs = [...form.querySelectorAll('input[name]')];
    const formData = new FormData();
    inputs.forEach((input) => {
      formData.append(input.getAttribute('name'), input.value);
    });

    try {
      execInElement(form, 'button', (button) => {
        const type = button.getAttribute('type') || 'submit';
        const isSubmit = type === 'submit';
        if (isSubmit) {
          button.setAttribute('disabled', 'true');
          button.setAttribute('data-previous-inner-text', button.innerText);
          button.innerText = loadingMessage;
        }
      });
      await fetch(formAction, {
        method: 'POST',
        body: formData,
      });
      execInElement(form, '.sheet-api-success-container', (span) => {
        span.innerText = successMessage;
      });
      inputs.forEach((input) => {
        input.value = '';
      });
    } catch (error) {
      execInElement(form, '.sheet-api-error-container', (span) => {
        span.innerText = errorMessage;
      });
      throw error;
    } finally {
      execInElement(form, 'button[data-previous-inner-text]', (button) => {
        button.innerText = button.getAttribute('data-previous-inner-text');
        button.removeAttribute('disabled');
      });
    }
  });
  form.setAttribute('data-sheet-api-processed', 'true');
};

const main = () => {
  setInterval(() => {
    const forms = getForms();
    forms.forEach(processForm);
  }, 200);
};
main();
