const getElements = () => {
  const markedElements = document.querySelectorAll('[data-sheet-api-url]');
  return [...markedElements];
};

export default getElements;
