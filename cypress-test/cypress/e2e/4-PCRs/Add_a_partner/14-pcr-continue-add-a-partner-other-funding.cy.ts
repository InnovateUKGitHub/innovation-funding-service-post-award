import { testFile } from "common/testfileNames";
import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  navigateToPartnerCosts,
  addPartnerDocUpload,
  pcrFileTable,
  otherFundingTable,
  addSourceOfFunding,
  fundingLevelPage,
  uploadPartnerInfo,
  otherFundingOptions,
  addSourceOfFundingValidation,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";
import { learnFiles } from "common/fileComponentTests";
import { completeLabourForm, displayCostCatTable, navigateToCostCat } from "./add-partner-e2e-steps";

describe("PCR > Add partner > Continuing editing PCR project costs section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  /**
   * Project costs for new partner section
   */

  it("Should display a cost category table", displayCostCatTable);

  it("Should access the Labour section", () => navigateToCostCat("Labour", 0));

  it("Should complete the Labour form", completeLabourForm);

  it("Should click 'Save and return to summary'", () => {
    cy.clickOn("Save and return to summary");
  });

  it("Should display the Labour costs on the summary page", () => {
    cy.getListItemFromKey("Project costs for new partner", "£6,666.60");
  });

  it("Should access the Other public sector funding section", () => {
    cy.getListItemFromKey("Other sources of funding?", "Edit").click();
  });

  it("Should display the 'Other public sector funding?' subheading and guidance information", () => {
    cy.get("h2").contains("Other public sector funding?");
    cy.paragraph("Is the new partner receiving any other public sector funding");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.heading("Add a partner");
  });

  it("Should click both radio buttons for 'Yes' and 'No' and finally select 'Yes", otherFundingOptions);

  it("Should click'Save and continue'", () => {
    cy.clickOn("Save and continue");
  });

  it("Should display guidance and the 'Other public sector funding?' subheading", () => {
    cy.paragraph("Include all sources of funding the new partner is receiving");
    cy.get("h2").contains("Other public sector funding?");
  });

  it("Should have a table containing any other sources of funding", otherFundingTable);

  it("Should contain an 'Add another source of funding'", () => {
    cy.contains("button", "Add another source of funding");
  });

  it("Should have a 'Save and continue' and 'Save and return to summary' button", () => {
    cy.submitButton("Save and continue");
    cy.submitButton("Save and return to summary");
  });

  it("Should click 'Add another source of funding' and then validate fields.", addSourceOfFundingValidation);

  it("Should reload the page and then continue through without adding information", () => {
    cy.reload();
    cy.get("h2").contains("Other public sector funding?");
    cy.clickOn("Save and continue");
    cy.get("h2").contains("Funding level");
    cy.clickOn("Save and continue");
    cy.get("legend").contains("Upload partner agreement");
  });

  it("Should save and return to summary and still display the project costs from the previous steps", () => {
    cy.clickOn("Save and return to summary");
    [
      ["Project costs for new partner", "£6,666.60"],
      ["Other sources of funding?", "Yes"],
      ["Funding from other sources", "£0.00"],
    ].forEach(([key, item]) => {
      cy.getListItemFromKey(key, item);
    });
  });

  it("Should now re-access Other sources of funding and complete", () => {
    cy.getListItemFromKey("Funding from other sources", "Edit").click();
    cy.get("h2").contains("Other public sector funding?");
    cy.contains("button", "Add another source of funding").click();
  });

  it("Should now enter valid information into the fields", addSourceOfFunding);

  it("Should reflect the value entered in the table", () => {
    cy.tableCell("£50,000.00");
  });

  it("Should 'Save and continue'", () => {
    cy.clickOn("Save and continue");
  });

  it("Should land on the 'Funding level' page and contain subheading and guidance information", fundingLevelPage);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.heading("Add a partner");
  });

  it("Should enter a percentage and click 'Save and continue'", () => {
    cy.get(`input[id="awardRate"]`).type("5");
    cy.clickOn("Save and continue");
  });

  it(
    "Should land on a document upload page and contain 'Upload partner agreement' subheading and display guidance information",
    uploadPartnerInfo,
  );

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.heading("Add a partner");
  });

  it("Should click the 'Learn more about files you can upload' and display information", learnFiles);

  it("Should upload a file", addPartnerDocUpload);

  it("Should display a document upload success message", () => {
    cy.validationNotification("Your document has been uploaded");
  });

  it("Should display a file upload table once document is uploaded", () =>
    pcrFileTable("Agreement to PCR", "Innovate UK"));

  it("Should allow the file to be deleted", () => {
    cy.button("Remove").click();
    cy.validationNotification(`'${testFile}' has been removed.`);
  });

  it("Should click 'Save and continue'", () => {
    cy.clickOn("Save and continue");
  });
});
