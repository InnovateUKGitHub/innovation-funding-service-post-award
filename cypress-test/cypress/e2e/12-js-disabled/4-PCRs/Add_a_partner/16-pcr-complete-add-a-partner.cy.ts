import { visitApp } from "common/visit";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import {
  shouldShowProjectTitle,
  navigateToPartnerCosts,
  addPartnerDocUpload,
  addPartnerSummaryTable,
  fundingLevelPercentage,
  validateFundingLevelInput,
  navigateToPartnerAgreement,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  learnFiles,
  allowLargerBatchFileUpload,
  validateFileUpload,
  uploadFileTooLarge,
  checkFileUploadSuccessDisappears,
} from "common/fileComponentTests";
import { seconds } from "common/seconds";

describe("PCR > Add partner > Complete add a partner", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", jsDisabled: true });
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
    pcrTidyUp("Add a partner");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  after(() => {
    cy.deletePcr("328407");
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should click 'Save and continue'", () => {
    cy.clickOn("Save and continue");
  });

  it("Should click the 'No' radio button and then save and continue", () => {
    cy.getByLabel("No").click();
    cy.clickOn("Save and continue");
  });

  it("Should validate the Funding level input", validateFundingLevelInput);

  it(
    "Should display 'Funding level' heading and enter a percentage and click 'Save and continue'",
    fundingLevelPercentage,
  );

  it("Should land on a document upload page and contain 'Upload partner agreement' subheading and display guidance information", () => {
    cy.get("legend").contains("Upload partner agreement");
    cy.paragraph("You must upload copies of signed letters");
  });

  it("Should display a clickable 'Learn more about files you can upload' message", learnFiles);

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a single file that is too large", uploadFileTooLarge);

  it(
    "Should attempt to upload three files totalling 33MB",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowLargerBatchFileUpload,
  );

  it("Should upload a file", addPartnerDocUpload);

  it("Should ensure doc upload message does NOT persist when navigating away", () =>
    checkFileUploadSuccessDisappears("request", "Request"));

  it("Should navigate forward to the partner agreement section", navigateToPartnerAgreement);

  it("Should save and continue", () => {
    cy.clickOn("Save and continue");
  });

  it("Should now display a summary page with all completed sections", addPartnerSummaryTable);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.heading("Add a partner");
  });

  it("Should have a 'Mark as complete box'", () => {
    cy.get("legend").contains("Mark as complete");
    cy.clickCheckBox("I agree with this change");
  });

  it("Should have a 'Save and return to request' button", () => {
    cy.submitButton("Save and return to request");
  });
});
