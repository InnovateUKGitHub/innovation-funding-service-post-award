import { visitApp } from "common/visit";
import {
  backOutToClaimsPage,
  downloadExceptionsStaff,
  downloadExceptionsStaffDocPage,
  documents as uploadDocuments,
} from "./steps";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import {
  allowLargerBatchFileUpload,
  learnFiles,
  validateFileUpload,
  uploadFileTooLarge,
  validateExcessiveFileName,
  doNotUploadSpecialChar,
  uploadFileNameTooShort,
  allowBatchFileUpload,
  rejectElevenDocsAndShowError,
  displayBatchUpload,
  deleteDocument,
} from "common/fileComponentTests";
import { fileTidyUp } from "common/filetidyup";
import { seconds } from "common/seconds";

const fcEmail = "s.shuang@irc.trde.org.uk.test";

const uploadDate = new Date().getFullYear().toString();

const documents = uploadDocuments.reverse();

describe("Claims > Cost category document uploads", () => {
  before(() => {
    visitApp({ asUser: fcEmail });
    cy.navigateToProject("328407");
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
  });

  after(() => {
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should click the claims tile and access the 'Exceptions - Staff' cost category", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
    cy.getByQA("current-claims-table").contains("Edit").click();
    cy.heading("Costs to be claimed");
    cy.tableCell("Exceptions - Staff").click();
    cy.heading("Exceptions - Staff");
  });

  it("Should click the upload and remove documents button ", () => {
    cy.clickOn("Upload and remove documents");
    cy.heading("Exceptions - Staff documents");
    fileTidyUp("Sarah Shuang");
  });

  it("Should display guidance on how downloads work", () => {
    cy.paragraph("All documents uploaded will be shown here. All documents open in a new window.");
  });

  it("Should display a clickable 'Learn more about files you can upload' message", learnFiles);

  it("should reject 11 documents and show an error", rejectElevenDocsAndShowError);

  it("Should refresh the page to clear the previous validation messaging", () => {
    cy.reload();
  });

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a single file that is too large", uploadFileTooLarge);

  it(
    "Should attempt to upload three files totalling 33MB",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowLargerBatchFileUpload,
  );

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

  it(
    "Should upload a batch of 10 documents",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowBatchFileUpload("claim-details"),
  );

  it("Should see a success message for '10 documents have been uploaded'", () => {
    cy.getByAriaLabel("success message").contains("10 documents have been uploaded.");
  });

  it("Should ensure all uploaded documents are displayed correctly", () =>
    displayBatchUpload("Claim evidence", "Sarah Shuang", true));

  it("Should navigate back to the cost category page and check the files are correctly showing there", () => {
    cy.backLink("Back to Exceptions - Staff").click();
    cy.heading("Exceptions - Staff");
    displayBatchUpload("Claim evidence", "Sarah Shuang", false);
  });

  it("Should navigate back to the documents section and delete all files", { retries: 0 }, () => {
    cy.clickOn("Upload and remove documents");
    cy.heading("Exceptions - Staff documents");

    for (const document of documents) {
      deleteDocument(document);
    }
  });

  it("Should back out to the claims page and access Exceptions - Equipment.", backOutToClaimsPage);

  it("Should download the file on the Exceptions - Staff page.", downloadExceptionsStaff);

  it(
    "Should download the file on screen on the document upload page of Exceptions Staff",
    downloadExceptionsStaffDocPage,
  );
});
