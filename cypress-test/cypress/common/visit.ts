const [username, password] = Cypress.env("BASIC_AUTH").split(":");

export const visitApp = ({
  path = "",
  asUser = "iuk.accproject@bjss.com.bjssdev",
}: {
  path?: string;
  asUser?: string;
}) => {
  cy.visit(path, { auth: { username, password } });
  cy.switchUserTo(asUser);
};
