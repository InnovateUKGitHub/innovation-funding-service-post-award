import { testEach } from "support/methods";
import { euiCostCleanUp, overheadsTidyUp } from "common/costCleanUp";
import { visitApp } from "../../common/visit";
import {
  additionalInformationHeading,
  allowFileUpload,
  clearUpLabourCostCat,
  correctTableHeaders,
  evidenceRequiredMessage,
  newCostCatLineItem,
  reflectCostAdded,
  returnToCostCatPage,
  shouldShowProjectTitle,
  standardComments,
  shouldShowCostCatTable,
  validateLineItem,
  clearUpOverheadsCostCat,
} from "./steps";
const fc = "james.black@euimeabs.test";
const sysUser = "iuk.accproject@bjss.com.bjssdev";
describe("claims > Editing a claim by accessing cost categories", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1" });
  });

  it("Should have a back option", () => {
    cy.backLink("Back to claims");
  });

  it("Should check whether cost categories are correct", euiCostCleanUp);

  it("Should check that Overheads cost category is correct and if not, correct it", overheadsTidyUp);

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

  it("Should allow you to enter a new cost category line item", newCostCatLineItem);

  it("Should display the same figure entered against 'Total costs'", () => {
    cy.get("span.currency").contains("£1,000.00");
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

  it("Should allow a file to be uploaded", allowFileUpload);

  it("Should return to the previous page", () => {
    cy.clickOn("Back to Labour");
  });

  it("Should contain additional information heading and messaging", additionalInformationHeading);

  it("Has an area for writing free-text comments", () => {
    cy.get("textarea").clear().type(standardComments);
  });

  it("Should count how many characters you have used", () => {
    cy.get("p.character-count").should("have.text", "You have 32694 characters remaining");
  });

  it("Should save and return to the first claims screen", () => {
    cy.clickOn("Save and return to claims");
  });

  it("Should reflect the £1000 change to the claim in the cost cat table", reflectCostAdded);

  it("Should re-access the claim line item, switch user and assert that notification of when you can delete a line item appears", () => {
    cy.get("a").contains("Labour").click();
    cy.heading("Labour");
    cy.switchUserTo(fc);
    cy.getByQA("claim-warning-content").should(
      "have.text",
      "You can only remove claim line items you created. For other claim line items you want to remove, set the value to zero and save.",
    );
    cy.switchUserTo(sysUser);
    cy.getByQA("claim-warning-content").should("not.exist");
  });

  it("Should clear the cost category line item and delete the file that was uploaded", clearUpLabourCostCat);

  it("Should return you to the cost category page", returnToCostCatPage);

  it("Should clear the Overheads cost category", clearUpOverheadsCostCat);

  it("Should return you to the cost category page", returnToCostCatPage);

  it("Should show accordions", () => {
    cy.clickOn("Status and comments log");
    cy.paragraph("There are no changes");
  });
});
