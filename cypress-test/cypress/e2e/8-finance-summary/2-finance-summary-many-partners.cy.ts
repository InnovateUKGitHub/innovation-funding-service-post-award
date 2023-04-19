import { visitApp } from "common/visit";
import { manyPartnerFinanceDetails, manyProjCostsToDate, manyWhenIarNeeded } from "./steps";

describe("Finance summary > Many partners", () => {
  before(() => {
    visitApp({});
    cy.navigateToProject("154870");
  });

  it("Should click the Finance summary tile", () => {
    cy.get("h2.card-link__title").contains("Finance summary").click();
  });

  it("Should have the project title", () => {
    cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
  });

  it("Should display a page heading", () => {
    cy.get("h1").contains("Finance summary");
  });

  it("Should display the 'Project costs to date' table with heading", manyProjCostsToDate);

  it("Should display the 'Partner finance details' table with heading", manyPartnerFinanceDetails);

  it("Should show when an IAR is needed", manyWhenIarNeeded);
});
