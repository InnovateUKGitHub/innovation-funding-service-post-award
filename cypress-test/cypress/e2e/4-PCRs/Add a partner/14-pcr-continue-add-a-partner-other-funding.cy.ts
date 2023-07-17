import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  navigateToPartnerCosts,
  learnFiles,
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

describe("PCR > Add partner > Continuing editing PCR project costs section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should click 'Save and continue'", () => {
    cy.submitButton("Save and continue").click();
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

  it("Should click both radio buttons for 'Yes' and 'No'", otherFundingOptions);

  it("Should click'Save and continue'", () => {
    cy.submitButton("Save and return to summary");
    cy.submitButton("Save and continue").click();
  });

  it("Should display guidance and the 'Other public sector funding?' subheading", () => {
    cy.paragraph("Include all sources of funding the new partner is receiving");
    cy.get("h2").contains("Other public sector funding?");
  });

  it("Should have a table containing any other sources of funding", otherFundingTable);

  it("Should contain an 'Add another source of funding'", () => {
    cy.getByQA("add-fund").contains("Add another source of funding");
  });

  it("Should have a 'Save and continue' and 'Save and return to summary' button", () => {
    cy.submitButton("Save and continue");
    cy.submitButton("Save and return to summary");
  });

  it("Should click 'Add another source of funding' and then validate fields.", addSourceOfFundingValidation);

  it("Should now clear and enter valid information into the fields", addSourceOfFunding);

  it("Should reflect the value entered in the table", () => {
    cy.tableCell("£50,000.00");
  });

  it("Should 'Save and continue'", () => {
    cy.submitButton("Save and continue").click();
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
    cy.submitButton("Save and continue").click();
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
    cy.getByQA("validation-message-content").contains("Your document has been uploaded");
  });

  it("Should display a file upload table once document is uploaded", pcrFileTable);

  it("Should click 'Save and continue'", () => {
    cy.submitButton("Save and return to summary");
    cy.submitButton("Save and continue").click();
  });
});
