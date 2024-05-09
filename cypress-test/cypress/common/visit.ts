export const visitApp = ({
  path = "/",
  asUser = "iuk.accproject@bjss.com.bjssdev",
  jsDisabled,
}: {
  path?: string;
  asUser?: string;
  jsDisabled?: boolean;
}) => {
  cy.clearAllCookies();
  cy.log(`**visitApp:${path} asUser:${asUser} jsDisabled:${jsDisabled}**`);
  cy.switchUserTo(asUser, { newPath: path, jsDisabled });
  cy.log(`Currently running: ${Cypress.spec.name}`);
};
