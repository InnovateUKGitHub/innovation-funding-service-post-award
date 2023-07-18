import { visitApp } from "common/visit";
import { periodSubWithDate, projCostsToDate, whenIarNeeded, partnerFinanceDetails } from "./steps";

const moEmail = "testman2@testing.com";

describe("Finance summary > As Monitoring Officer", () => {
  before(() => {
    visitApp({ asUser: moEmail });
    cy.navigateToProject("328407");
  });

  it("Should click the Finance summary tile", () => {
    cy.selectTile("Finance summary");
  });

  it("Should have a back link", () => {
    cy.backLink("Back to project overview");
  });

  it("Should have the project title", () => {
    cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
  });

  it("Should display a page heading", () => {
    cy.heading("Finance summary");
  });

  it("Should display the project period subheading and date", periodSubWithDate);

  it("Should display the 'Project costs to date' table with heading", projCostsToDate);

  it("Should display the 'Partner finance details' table with heading", partnerFinanceDetails);

  it("Should show when an IAR is needed", whenIarNeeded);
});
