/* eslint-disable no-param-reassign */

const getData = async (url) => {
  const responseJSON = await fetch(url).then((r) => r.json());
  return responseJSON;
};

const processElement = (element) => {
  const url = element.getAttribute('data-sheet-api-url');
  element.removeAttribute('data-sheet-api-url');
  const oldHTML = element.innerHTML;
  element.innerHTML = '';

  const replaceHTMLInElement = async () => {
    const data = await getData(url);
    const newHTML = data.map((object) => {
      Object.entries(object).forEach(([key, value]) => {
        object[key.trim()] = value;
      });

      return oldHTML.replace(/{{([^{}]*)}}/g, (match, key) => object[key.trim()]);
    }).join('');
    element.innerHTML = newHTML;
  };
  replaceHTMLInElement();

  const refreshTime = parseFloat(element.getAttribute('data-refresh-time')) || 0;
  if (refreshTime) {
    setInterval(replaceHTMLInElement, refreshTime * 1000);
  }
};

export default processElement;
