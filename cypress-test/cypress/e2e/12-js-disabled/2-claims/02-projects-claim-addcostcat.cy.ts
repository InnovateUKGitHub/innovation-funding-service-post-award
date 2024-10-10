import { testEach } from "support/methods";
import { euiCostCleanUpJsDisabled, overheadsTidyUpJsDisabled } from "common/costCleanUp";
import { visitApp } from "../../../common/visit";
import {
  additionalInformationHeading,
  allowFileUpload,
  clearUpLabourCostCatJsDisabled,
  correctTableHeaders,
  evidenceRequiredMessage,
  newCostCatLineItemJsDisabled,
  reflectCostAdded,
  returnToCostCatPage,
  shouldShowProjectTitle,
  standardComments,
  shouldShowCostCatTable,
  validateLineItem,
  clearUpOverheadsCostCatJsDisabled,
} from "./steps";
import { loremIpsum33k } from "common/lorem";
const fc = "james.black@euimeabs.test";
const sysUser = "iuk.accproject@bjss.com.bjssdev";
describe("js-disabled > claims > Editing a claim by accessing cost categories", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: fc, path: "projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1", jsDisabled: true });
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to claims");
  });

  it("Should check whether cost categories are correct", euiCostCleanUpJsDisabled);

  it("Should check that Overheads cost category is correct and if not, correct it", overheadsTidyUpJsDisabled);

  testEach([
    "Category",
    "Total eligible costs",
    "Eligible costs claimed to date",
    "Costs claimed this period",
    "Remaining eligible costs",
  ])('should have a cost category table with "$0" category', shouldShowCostCatTable);

  it("Should let you click on the cost category 'Labour'", () => {
    cy.get("td.govuk-table__cell").contains("Labour").click();
  });

  it("Should still display the project title", shouldShowProjectTitle);

  it("Should have a back option", () => {
    cy.backLink("Back to claim");
  });

  it("Should show relevant messaging at the top of the page", () => {
    cy.getByQA("guidance-message").should("contain.text", "You must break down your total costs");
  });

  it("Should present a table with line item information", correctTableHeaders);

  it("Should allow you to enter a new cost category line item", () => newCostCatLineItemJsDisabled(false));

  it("Should save and reflect this value on the Costs to be claimed screen", () => {
    cy.clickOn("Save and return to claims");
    cy.heading("Costs to be claimed");
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("td:nth-child(4)").contains("£1,000.00");
      });
  });

  it("Should re-access the Labour category", () => {
    cy.get("a").contains("Labour").click();
    cy.heading("Labour");
  });

  it("Should type over the £1000 figure with an invalid number and check for validation", validateLineItem);

  it("Should display relevant messaging surrounding Supporting documents", evidenceRequiredMessage);

  it("Should navigate to files upload area", () => {
    cy.clickOn("Upload and remove documents");
  });

  it("Should validate doc uploads by clicking Upload without selecting a document", () => {
    cy.clickOn("button", "Upload documents");
    cy.validationMessage("Choose a file to upload");
  });

  //it("Should allow a file to be uploaded", allowFileUpload);

  it("Should return to the previous page", () => {
    cy.clickOn("Back to Labour");
  });

  it("Should contain additional information heading and messaging", additionalInformationHeading);

  it("Should validate the free-text box", () => {
    cy.textValidation("Comments", 32768, "Save and return to claims", true, true);
    cy.get("a").contains("Labour").click();
    cy.heading("Labour");
  });

  it("Should update the box with standard characters and count the total remaining", () => {
    cy.get("textarea").clear().type(standardComments);
  });

  it("Should save and return to the first claims screen", () => {
    cy.clickOn("Save and return to claims");
  });

  it("Should reflect the £1000 change to the claim in the cost cat table", reflectCostAdded);

  it("Should clear the cost category line item and delete the file that was uploaded", euiCostCleanUpJsDisabled);

  it("Should show accordions", () => {
    cy.clickOn("Status and comments log");
    cy.paragraph("There are no changes");
  });
});
