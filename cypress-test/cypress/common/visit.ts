const [username, password] = Cypress.env("BASIC_AUTH").split(":");

export const visitApp = (path: string = "") => {
  cy.visit(path, { auth: { username, password } });
};
