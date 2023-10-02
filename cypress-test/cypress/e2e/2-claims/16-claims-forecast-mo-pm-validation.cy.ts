import { visitApp } from "common/visit";

const pm = "james.black@euimeabs.test";
const MO = "testman2@testing.com";

describe("Claims > Forecast as PM/MO", () => {
  before(() => {
    visitApp({ asUser: pm });
    cy.navigateToProject("154870");
  });

  it("Should access the claims tile as PM and view the open claim for Munce Inc", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
    cy.tableCell("Munce inc").siblings().contains("View").click();
    cy.heading("Claim");
    cy.get("h2").contains("Munce Inc claim for period 1");
  });

  it("Should click 'Show all sections''", () => {
    cy.button("Show all sections").click();
  });

  it("Should display validation information under the forecast section showing there is an overspend", () => {});
});
