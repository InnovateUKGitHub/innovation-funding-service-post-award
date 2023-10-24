export const visitApp = ({
  path = "/",
  asUser = "iuk.accproject@bjss.com.bjssdev",
}: {
  path?: string;
  asUser?: string;
}) => {
  cy.clearAllCookies();
  cy.log(`**visitApp:${path} asUser:${asUser}**`);
  cy.switchUserTo(asUser, path);
  cy.log(`Currently running: ${Cypress.spec.name}`);
};
