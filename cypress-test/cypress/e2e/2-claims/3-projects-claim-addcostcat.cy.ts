import { visitApp } from "../../common/visit";
import {
  additionalInformationHeading,
  allowFileUpload,
  clearUpCostCat,
  correctTableHeaders,
  evidenceRequiredMessage,
  newCostCatLineItem,
  reflectCostAdded,
  returnToCostCatPage,
  shouldShowAllAccordion,
  shouldShowCostCatTable,
  shouldShowProjectTitle,
  standardComments,
} from "./steps";

describe("Editing a claim by accessing cost categories", () => {
  before(() => {
    visitApp("projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to claims");
  });

  it("Should have the cost category table", shouldShowCostCatTable);

  it("Should let you click on the cost category 'Labour'", () => {
    cy.get("td.govuk-table__cell").contains("Labour").click();
  });

  it("Should still display the project title", shouldShowProjectTitle);

  it("Should show relevant messaging at the top of the page", () => {
    cy.getByQA("guidance-message").should("contain.text", "evidence");
  });

  it("Should display a table for updating cost categories", () => {
    cy.get("table.govuk-table");
  });

  it("The table should have correct headers", correctTableHeaders);

  it("Should allow you to enter a new cost category line item", newCostCatLineItem);

  it("Should display the same figure entered against 'Total costs'", () => {
    cy.get("span.currency").contains("£1,000.00");
  });

  it("Should display relevant messaging surrounding Supporting documents", evidenceRequiredMessage);

  /**
   * The cy intercept and cy waits in this file are not currently functioning correctly despite the api link being a match
   */

  it("Should navigate to files upload area", () => {
    //cy.intercept("POST", "/api/claim-details/*").as("uploadArea");
    cy.submitButton("Upload and remove documents").click();
    cy.wait(5000);
  });

  it("Should allow a file to be uploaded", allowFileUpload);

  it("Should return to the previous page", () => {
    cy.get("a.govuk-back-link").click();
  });

  it("Should contain additional information heading and messaging", additionalInformationHeading);

  it("Has an area for writing free-text comments", () => {
    cy.getByQA("info-text-area").clear().type(standardComments);
  });

  it("Should count how many characters you have used", () => {
    cy.get("p.character-count").should("contain.text", "You have 74 characters");
  });

  it("Should save and return to the first claims screen", () => {
    cy.submitButton("Save and return to claims").click();
    cy.wait(5000);
  });

  it("Should reflect the £1000 change to the claim in the cost cat table", reflectCostAdded);

  it("Should clear the cost category line item and delete the file that was uploaded", clearUpCostCat);

  it("Should return you to the cost category page", returnToCostCatPage);

  it("Should have accordions", shouldShowAllAccordion);
});
