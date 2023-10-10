import { visitApp } from "../../../common/visit";
import {
  reallocateCostsGiveInfoTodo,
  reallocateCostsPcrType,
  reallocateCostsTableHeaders,
  requestHeadingDetailsHeading,
  shouldShowProjectTitle,
  showPartners,
  validateGrantMoving,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Reallocate Costs > 2 -Continues Reallocate costs to the costs tables page to access each partner", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Reallocate project costs");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a Reallocate Partner costs PCR", () => {
    cy.createPcr("Reallocate project costs");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", requestHeadingDetailsHeading);

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type", reallocateCostsPcrType);

  /**
   * Potentially add a step to click into 'Add types' to ensure this function is working and then back out to this page
   */
  it("Should allow you to add more types of PCR", () => {
    cy.get("a.govuk-link").contains("Add types");
  });

  it("Should show select 'Give us information' and continue to the next page", reallocateCostsGiveInfoTodo);

  it("Should click 'Reallocate project costs' and continue to the next page", () => {
    cy.get("a").contains("Reallocate project costs").click();
  });

  it("Should show back to project link", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Reallocate project costs' heading", () => {
    cy.heading("Reallocate project costs");
  });

  it("Should show correct table headers", reallocateCostsTableHeaders);

  it("Should show the partners listed", showPartners);

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

  it("Should validate the grant moving over financial year input", validateGrantMoving);

  it("Clears the input and types a valid number", () => {
    cy.get("input#grantMovingOverFinancialYear").type("10000");
  });

  it("Has a mark as complete section", () => {
    cy.get("h2").contains("Mark as complete");
    cy.clickCheckBox("I agree with this change");
  });

  it("Has a save and return to request button", () => {
    cy.submitButton("Save and return to request");
  });
});
