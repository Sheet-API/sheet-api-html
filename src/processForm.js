/* eslint-disable no-param-reassign */
import execInElement from './execInElement';

const processForm = (form) => {
  const url = form.getAttribute('data-sheet-api-url');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    form.setAttribute('action', url);
    form.setAttribute('method', 'POST');

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
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.status >= 400) {
        execInElement(form, '.sheet-api-error-container', (span) => {
          span.innerText = errorMessage;
        });
        return;
      }
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
  form.removeAttribute('data-sheet-api-url');
};

export default processForm;
