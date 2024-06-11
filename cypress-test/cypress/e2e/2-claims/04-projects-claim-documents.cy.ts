import { visitApp } from "../../common/visit";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import { claimsDocUpload, claimsFileTable, selectFileDescription, shouldShowProjectTitle } from "./steps";
import { fileTidyUp } from "common/filetidyup";
import { testFile } from "common/testfileNames";
import {
  learnFiles,
  allowLargerBatchFileUpload,
  validateFileUpload,
  uploadFileTooLarge,
  uploadSingleChar,
  deleteSingleChar,
  validateExcessiveFileName,
  doNotUploadSpecialChar,
  uploadFileNameTooShort,
  checkFileUploadSuccessDisappears,
} from "common/fileComponentTests";
import { seconds } from "common/seconds";
const pmEmail = "james.black@euimeabs.test";

describe("claims > documents upload screen", () => {
  before(() => {
    cy.intercept("POST", "/api/documents/claim-details/*").as("uploadDocument");
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1/documents" });
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
    fileTidyUp(testFile);
  });

  after(() => {
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to costs to be claimed");
  });

  it("Should still display the project title", shouldShowProjectTitle);

  it("Should have an upload heading", () => {
    cy.get("h2").contains("Upload");
  });

  it("Should display a clickable 'Learn more about files you can upload' message", learnFiles);

  it("Should have a description dropdown to describe the file you are uploading", selectFileDescription);

  it("should allow you to upload a file", claimsDocUpload);

  it("Should display a document upload validation message", () => {
    cy.validationNotification("Your document has been uploaded.");
  });

  it("Should ensure the upload notification does NOT persist", () =>
    checkFileUploadSuccessDisappears("costs to be claimed", "Costs to be claimed"));

  it("Should back out further and assert notification does NOT persist", () =>
    checkFileUploadSuccessDisappears("claims", "Claims"));

  it("Should access the claim again", () => {
    cy.get("a").contains("Edit").click();
    cy.heading("Costs to be claimed");
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should display the Files uploaded heading", () => {
    cy.get("h2").contains("Files uploaded");
  });

  it("Should display descriptive message", () => {
    cy.get("p.govuk-body").contains("uploaded");
  });

  it("Should show a table of information", claimsFileTable);

  it("Should show the file that's just been uploaded", () => {
    cy.get("a.govuk-link").contains("testfile.doc");
  });

  it("Should allow you to delete the document that was just uploaded", () => {
    cy.clickOn("Remove");
    cy.button("Remove").should("be.disabled");
    cy.validationNotification(`'${testFile}' has been removed.`);
  });

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a single file that is too large", uploadFileTooLarge);

  it(
    "Should attempt to upload three files totalling 33MB",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowLargerBatchFileUpload,
  );

  it("Should upload a file with a single character as the name", uploadSingleChar);

  it("Should delete the file with a single character as the name", deleteSingleChar);

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

  it("Should save and return to claims", () => {
    cy.wait(500);
    cy.get("a.govuk-button--secondary").click();
    cy.heading("Claims");
  });
});
