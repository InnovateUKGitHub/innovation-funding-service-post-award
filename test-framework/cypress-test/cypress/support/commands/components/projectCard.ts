const selectProjectCard = (projectNumber: string | number) => {
  const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
  cy.log("**navigateToProject**");
  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).contains(projectNumber).click({ force: true });
};

const projectCardCommands = {
  selectProjectCard,
};

export { projectCardCommands };
