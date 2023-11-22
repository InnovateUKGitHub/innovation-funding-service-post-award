import { visitApp } from "common/visit";
import { sbriAccessABSClaim, sbriCorrectForecastCostCat, sbriDocGuidance } from "./steps";

const fc = "s.shuang@irc.trde.org.uk.test";

/**
 * The purpose of this testcase is to test the differences between SBRI and a standard CR&D claim.
 * It does not test all functionality as this is completed on other testcases.
 */
describe("Claims > SBRI > Documents & Forecast", () => {
  before(() => {
    visitApp({ asUser: fc });
    cy.navigateToProject("597638");
  });

  it("Should display the correct project number and page title", () => {
    cy.getByQA("page-title-caption").contains("597638");
    cy.heading("Project overview");
  });

  it(
    "Should access the claims tile and display the correct VAT messaging and click into the ABS Claim",
    sbriAccessABSClaim,
  );

  it("Should continue to the documents page", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should display correct VAT messaging around doc uploads", sbriDocGuidance);

  it("Should continue to the forecast page", () => {
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
  });

  it("Should display 'last chance to change the forecast' message", () => {
    cy.validationNotification("This is your last chance to change the forecast for period 2");
  });

  it("Should display correct forecast cost categories for SBRI", sbriCorrectForecastCostCat);

  it("Should continue to the summary page", () => {
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });
});
