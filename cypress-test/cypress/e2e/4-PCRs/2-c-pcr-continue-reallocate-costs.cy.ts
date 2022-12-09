import { visitApp } from "../../common/visit";
import { backToSummary, shouldShowProjectTitle } from "./steps";

describe("Continues Reallocate costs to the costs tables page to access each partner", () => {
  before(() => {
    visitApp("projects/a0E2600000kSotUEAS/pcrs/create");
  });

  it("Should select 'Reallocate project costs' checkbox", () => {
    cy.clickCheckBox("Reallocate project costs");
  });

  it("Will click Create request button and proceed to next page", () => {
    cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
    cy.submitButton("Create request").click();
    cy.wait("@pcrPrepare");
    cy.get("h1").should("contain.text", "Request");
  });

  it("Should show select 'Give us information' and continue to the next page", () => {
    cy.get("h2.app-task-list__section").contains("Give us information");
    cy.get("span.app-task-list__task-name").contains("Reallocate project costs").click();
    cy.wait(2000);
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the partners listed", () => {
    cy.tableCell("EUI Small Ent Health");
    cy.tableCell("A B Cad Services");
    cy.tableCell("ABS EUI Medium Enterprise");
  });

  it("Should allow you to navigate to EUI Small Ent Health", () => {
    cy.get("td.govuk-table__cell").contains("EUI Small Ent Health").click();
    cy.wait(5000);
  });

  it("Should show back to summary link", backToSummary);

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Reallocate costs' heading and partner name", () => {
    cy.get("h1").contains("Reallocate costs");
    cy.get("h2").contains("EUI Small Ent Health");
  });

  it("Should display reallocate costs table headers", () => {
    cy.tableHeader("Cost category");
    cy.tableHeader("Total eligible costs");
    cy.tableHeader("Costs claimed");
    cy.tableHeader("New total eligible costs");
    cy.tableHeader("Costs reallocated");
  });

  it("Should display the reallocate costs table cost categories", () => {
    cy.tableCell("Labour");
    cy.tableCell("Overheads");
    cy.tableCell("Materials");
    cy.tableCell("Capital usage");
    cy.tableCell("Subcontracting");
    cy.tableCell("Tracel and subsistence");
    cy.tableCell("Other costs");
    cy.tableCell("Other costs 2");
    cy.tableCell("Other costs 3");
    cy.tableCell("Other costs 4");
    cy.tableCell("Other costs 5");
    cy.tableCell("Partner totals");
  });

  it("Should display a 'Summary of project costs' section", () => {
    cy.tableHeader("Total eligible costs");
  });

  /**
   * This assumes the value in the current box is 35000 as per project creation script
   */
  it("Should have numeric text boxes to change costs", () => {
    cy.get("input#a0626000007qoQlAAI").clear().type("34000");
  });

  it("Should reflect the change in costs in the costs reallocated column", () => {
    cy.tableCell("-£1000");
  });

  it("Should have a 'Save and return to reallocate project costs' button", () => {
    cy.submitButton("Save and return to reallocate project costs").click();
    cy.wait(5000);
  });

  it("Should return to the 'Reallocate costs screen", () => {
    cy.get("h1").contains("Reallocate project costs");
  });

  it("Has an input box for grant moving over financial year", () => {
    cy.get("input#grantMovingOverFinancialYear").type("0");
  });

  it("Has a mark as complete section", () => {
    cy.get("h2").contains("Mark as complete");
    cy.get("input#itemStatus_true.govuk-checkboxes__input").click();
    cy.wait(2000);
  });

  it("Has a save and return to request button", () => {
    cy.submitButton("Save and return to request").click();
  });
});
