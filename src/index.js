/* eslint-disable no-param-reassign */
import getForms from './getForms';
import getElements from './getElements';
import processForm from './processForm';
import processElement from './processElement';

const main = () => {
  setInterval(() => {
    const forms = getForms();
    forms.forEach(processForm);

    const elements = getElements();
    elements.forEach(processElement);
  }, 200);
};
main();
