const [username, password] = Cypress.env("BASIC_AUTH").split(":");

export const visitApp = ({
  path = "",
  asUser = "iuk.accproject@bjss.com.bjssdev",
}: {
  path?: string;
  asUser?: string;
}) => {
  cy.clearAllCookies();
  cy.log(`**visitApp:${path} asUser:${asUser}**`);
  cy.wait(1000);
  cy.visit(path, { auth: { username, password } });
  cy.wait(1000);
  cy.switchUserTo(asUser);
  cy.log(`Currently running: ${Cypress.spec.name}`);
};
