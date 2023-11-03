const selectTile = (label: string) => {
  cy.get(".card-link").contains(label).click();
};

const tileCommands = { selectTile };
export { tileCommands };
