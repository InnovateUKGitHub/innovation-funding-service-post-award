import { visitApp } from "../../../common/visit";
import {
  clickCreateRequestButtonProceed,
  deletePcr,
  reallocateCostsGiveUsInfoContinue,
  markAsComplete,
  reallocateCostsAndPartner,
  reallocateCostsCats,
  reallocateCostsTableHeaders,
  shouldShowProjectTitle,
  showPartners,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Reallocate Costs > 3 - Continues Reallocate costs to the costs tables page to access each partner", () => {
  before(() => {
    // cy.intercept("POST", "/projects/*/pcrs/*/prepare").as("pcrPrepare");
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Reallocate project costs");
  });

  after(deletePcr);

  it("Should select 'Reallocate project costs' checkbox", () => {
    cy.clickCheckBox("Reallocate project costs");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should show select 'Give us information' and continue to the next page", reallocateCostsGiveUsInfoContinue);

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display reallocate costs table headers", reallocateCostsTableHeaders);

  it("Should show the partners listed", showPartners);

  it("Should allow you to navigate to EUI Small Ent Health", () => {
    cy.get("td.govuk-table__cell").contains("EUI Small Ent Health").click();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to summary");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Reallocate costs' heading and partner name", reallocateCostsAndPartner);

  it("Should display the reallocate costs table cost categories", reallocateCostsCats);

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
    cy.tableCell("-£1,000.00");
  });

  it("Should have a 'Save and return to reallocate project costs' button", () => {
    cy.submitButton("Save and return to reallocate project costs").click();
  });

  it("Should return to the 'Reallocate costs screen", () => {
    cy.get("h1").contains("Reallocate project costs");
  });

  it("Has an input box for grant moving over financial year", () => {
    cy.get("input#grantMovingOverFinancialYear").type("0");
  });

  it("Has a mark as complete section", markAsComplete);

  it("Has a save and return to request button", () => {
    cy.submitButton("Save and return to request").click();
  });
});
