const execInElement = (container, selector, func) => {
  [...container.querySelectorAll(selector)].forEach(func);
};

export default execInElement;
