const getForms = () => {
  const markedForms = document.querySelectorAll('form[data-sheet-api-url]');
  return [...markedForms];
};

export default getForms;
