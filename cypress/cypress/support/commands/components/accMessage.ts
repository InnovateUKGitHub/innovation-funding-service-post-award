const getSuccessMessage = () => {
  return cy.get(".acc-message.acc-message__success");
};

const accMessageCommands = {
  getSuccessMessage,
};

export { accMessageCommands };
