const getSuccessMessage = () => {
  return cy.get(".acc-message.acc-message__success");
};

const getValidationMessage = () => {
  return cy.get(".govuk-error-summary");
};

const messageCommands = {
  getSuccessMessage,
  getValidationMessage,
};

export { messageCommands };
