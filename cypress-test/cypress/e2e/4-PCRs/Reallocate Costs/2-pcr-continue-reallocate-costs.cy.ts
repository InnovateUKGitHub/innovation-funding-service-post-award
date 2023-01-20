import { visitApp } from "../../../common/visit";
import { deletePcr, shouldShowProjectTitle } from "../steps";

describe("Continues Reallocate costs to the costs tables page to access each partner", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
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

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", () => {
    cy.get("h1").contains("Request");
    cy.get("h2").contains("Details");
  });

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type", () => {
    cy.get("dt.govuk-summary-list__key").contains("Types");
    cy.get("dd.govuk-summary-list__value").contains("Reallocate project costs");
  });

  /**
   * Potentially add a step to click into 'Add types' to ensure this function is working and then back out to this page
   */
  it("Should allow you to add more types of PCR", () => {
    cy.get("a.govuk-link").contains("Add types");
  });

  it("Should show select 'Give us information' and continue to the next page", () => {
    cy.get("h2.app-task-list__section").contains("Give us information");
    cy.get("span.app-task-list__task-name").contains("Reallocate project costs").click();
  });

  it("Should show back to project link", () => {
    cy.get("a.govuk-back-link", { timeout: 10000 }).contains("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Reallocate project costs' heading", () => {
    cy.get("h1").contains("Reallocate project costs");
  });

  it("Should show correct table headers", () => {
    cy.tableHeader("Partner");
    cy.tableHeader("Total eligible costs");
    cy.tableHeader("Remaining costs");
    cy.tableHeader("Remaining grant");
    cy.tableHeader("New total eligible costs");
    cy.tableHeader("New remaining costs");
    cy.tableHeader("New remaining grant");
  });

  it("Should show the partners listed", () => {
    cy.tableCell("EUI Small Ent Health");
    cy.tableCell("A B Cad Services");
    cy.tableCell("ABS EUI Medium Enterprise");
  });

  it("Should contain remaining grant message", () => {
    cy.get("p.govuk-body").contains("remaining grant");
  });

  it("Should have 'Change remaining grant' button", () => {
    cy.get("a.govuk-button--secondary").contains("Change remaining grant");
  });

  it("Should display 'Grant moving over financial year' message", () => {
    cy.get("h2").contains("Grant value moving over the financial year end");
  });

  it("Should display end of financial year message", () => {
    cy.get("p.govuk-body").contains("The financial year ends");
  });

  it("Has an input box for grant moving over financial year", () => {
    cy.get("input#grantMovingOverFinancialYear").type("1000000");
  });

  it("Has a mark as complete section", () => {
    cy.get("h2").contains("Mark as complete");
    cy.get("input#itemStatus_true.govuk-checkboxes__input").click();
  });

  it("Has a save and return to request button", () => {
    cy.submitButton("Save and return to request");
  });
});
