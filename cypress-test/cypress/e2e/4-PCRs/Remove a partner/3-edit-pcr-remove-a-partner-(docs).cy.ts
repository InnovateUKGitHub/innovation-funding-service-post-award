import { testFile } from "common/testfileNames";
import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  learnFiles,
  pcrDocUpload,
  pcrFileTable,
  clickPartnerAddPeriod,
  removePartnerGuidanceInfo,
} from "../steps";
import {
  validateFileUpload,
  uploadFileTooLarge,
  uploadSingleChar,
  deleteSingleChar,
  uploadFileNameTooShort,
  validateExcessiveFileName,
  doNotUploadSpecialChar,
} from "e2e/3-documents/steps";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import { fileTidyUp } from "common/filetidyup";
import { pcrTidyUp } from "common/pcrtidyup";
const pmEmail = "james.black@euimeabs.test";

describe("PCR > Remove partner > Continuing editing the Remove a partner section once a partner is selected", () => {
  before(() => {
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    createTestFile("bigger_test", 33);
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("328407");
    deleteTestFile("bigger_test");
  });

  it("Should create a Remove partner PCR", () => {
    cy.createPcr("Remove a partner");
  });

  it("Should click the Remove partner link to begin editing the PCR", () => {
    cy.get("a").contains("Remove a partner").click();
  });

  it("Should click a partner name before entering a period number and proceeding", clickPartnerAddPeriod);

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have the page title 'Remove a partner'", () => {
    cy.heading("Remove a partner");
  });

  it("Should have a subheading 'Upload withdrawal of partner certificate'", () => {
    cy.get("legend").contains("Upload withdrawal of partner certificate");
  });

  it("Should have guidance information on what is required", removePartnerGuidanceInfo);

  it("Should display a clickable 'Learn more about files you can upload' message", learnFiles);

  it("Should ensure no files are present and delete any that are", () => fileTidyUp("James Black"));

  it("Should have 'No documents uploaded.' message at the bottom", () => {
    cy.paragraph("No documents uploaded.");
  });

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a file that is too large", uploadFileTooLarge);

  it("Should upload a file with a single character as the name", uploadSingleChar);

  it("Should delete the file with the very short file name", deleteSingleChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  it("Should allow you to upload a file", pcrDocUpload);

  it("Should display a document upload validation message", () => {
    cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
  });

  it("Should display the Files uploaded heading", () => {
    cy.get("h2").contains("Files uploaded");
  });

  it("Should display descriptive message", () => {
    cy.get("p.govuk-body").contains("uploaded");
  });

  it("Should show a table of information", () => pcrFileTable("Withdrawal of partner certificate", "James Black"));

  it("Should show the file that's just been uploaded", () => {
    cy.get("a.govuk-link").contains("testfile.doc");
  });

  it("Should allow you to delete the document that was just uploaded", () => {
    cy.button("Remove").click();
    cy.validationNotification(`'${testFile}' has been removed.`);
  });

  it("Should have a 'Save and continue' button", () => {
    cy.submitButton("Save and continue");
  });

  it("Should have a working back link", () => {
    cy.backLink("Back to request").click();
    cy.heading("Request");
  });
});
