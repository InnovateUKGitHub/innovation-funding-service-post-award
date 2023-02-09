import { visitApp } from "common/visit";
import { partnerFinanceDetails, projCostsToDate, whenIarNeeded } from "./steps";
var currentYear = new Date();
var thisYear = currentYear.getFullYear();

describe("Finance summary", () => {
  before(() => {
    visitApp({});
    cy.navigateToProject();
  });

  it("Should click the Finance summary tile", () => {
    cy.get("h2.card-link__title").contains("Finance summary").click();
  });

  it("Should have a back link", () => {
    cy.backLink("Back to project overview");
  });

  it("Should have the project title", () => {
    cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
  });

  it("Should display a page heading", () => {
    cy.get("h1").contains("Finance summary");
  });

  it("Should display the project period subheading and date", () => {
    cy.get("h2").contains("Project period");
    cy.get("span").contains(thisYear);
  });

  it("Should display the 'Project costs to date' table with heading", projCostsToDate);

  it("Should display the 'Partner finance details' table with heading", partnerFinanceDetails);

  it("Should show when an IAR is needed", whenIarNeeded);
});
