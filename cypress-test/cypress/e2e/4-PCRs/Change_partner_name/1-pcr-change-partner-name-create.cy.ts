import { visitApp } from "../../../common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  shouldShowProjectTitle,
  requestHeadingDetailsHeading,
  changeNamePcrType,
  tickEachPartner,
  saveContinueProceed,
  uploadNameChange,
  summaryOfChanges,
  assertChangeNamePage,
  completeChangeName,
  changeNameHeadings,
  validateChangeName,
  pcrFileTable,
  changeNameListItems,
  changeNameClickEachEdit,
  exceedNewNamePromptValidation,
} from "../steps";
import { testFile } from "common/testfileNames";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import {
  learnFiles,
  allowLargerBatchFileUpload,
  validateFileUpload,
  uploadFileTooLarge,
  uploadSingleChar,
  deleteSingleChar,
  uploadFileNameTooShort,
  validateExcessiveFileName,
  doNotUploadSpecialChar,
  checkFileUploadSuccessDisappears,
} from "common/fileComponentTests";
import { seconds } from "common/seconds";
import { loremIpsum256Char } from "common/lorem";
const projectManager = "james.black@euimeabs.test";

describe("PCR >  Change a partner's name > Create PCR", () => {
  before(() => {
    visitApp({ asUser: projectManager, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Change a partner's name");
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
  });

  after(() => {
    cy.deletePcr("328407");
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should create a Change partner name PCR", () => {
    cy.createPcr("Change a partner's name");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", requestHeadingDetailsHeading);

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type and continue to begin the PCR", changeNamePcrType);

  it("Should click Change a partner's name and continue", () => {
    cy.get("a").contains("Change a partner's name").click();
  });

  it("Should contain the PCR title, correct project title and back button", changeNameHeadings);

  it(
    "Should continue without selecting a partner and without entering a new name, validating that both are required.",
    validateChangeName,
  );

  it("Should contain guidance information and tick each list item of partners", tickEachPartner);

  it("Should attempt to enter a name that is too long and receive a validation message", exceedNewNamePromptValidation);

  it("Should allow you to enter the new name", () => {
    cy.getByLabel("Enter new name").wait(500).clear().type("*$%^& Munce Inc");
  });

  it("Should click the save and continue button to proceed", saveContinueProceed);

  it("Should contain a 'Learn more about files you can upload' section", learnFiles);

  it("Should show a files uploaded area with no files", () => {
    cy.get("h2").contains("Files uploaded");
    cy.paragraph("No documents uploaded.");
  });

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a single file that is too large", uploadFileTooLarge);

  it(
    "Should attempt to upload three files totalling 33MB prompting validation",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowLargerBatchFileUpload,
  );

  it("Should upload a file with a single character as the name", uploadSingleChar);

  it("Should back out and ensure the notification does NOT persist", () =>
    checkFileUploadSuccessDisappears("request", "Request"));

  it("Should re-access the PCR and navigate to document section again", () => {
    cy.get("a").contains("Change a partner's name").click();
    cy.getListItemFromKey("Change of name certificate", "Edit").click();
    cy.get("legend").contains("Upload change of name certificate");
  });

  it("Should delete the file with the very short file name", deleteSingleChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  it("Should upload a file", uploadNameChange);

  it("Should now show the files uploaded", () => pcrFileTable("Certificate of name change", "James Black"));

  it("Should delete the file and display the correct validation message", () => {
    cy.button("Remove").click();
    cy.validationNotification(`'${testFile}' has been removed.`);
  });

  it("Should upload another file and click 'Save and continue'", () => {
    cy.fileInput("testfile.doc");
    cy.button("Upload documents").click();
    cy.validationNotification("Your document has been uploaded");
    cy.button("Save and continue").click();
  });

  it("Should display a summary of changes", summaryOfChanges);

  it("Should again display the PCR title, correct project title and back button", assertChangeNamePage);

  it("Should have a mark as complete section and click the tick box before saving and returning", completeChangeName);

  it("Should navigate back into 'Change a partner's name'", () => {
    cy.get("a").contains("Change a partner's name (*$%^& Munce Inc)").click();
    cy.heading("Change a partner's name");
  });

  it("Should present the list items of the PCR including 'Edit buttons'", changeNameListItems);

  it("Should click into each 'Edit' button in turn", changeNameClickEachEdit);

  it("Should save and return to request to display the section now as 'Incomplete'", () => {
    cy.button("Save and return to request").click();
    cy.heading("Request");
    cy.get("strong").contains("Incomplete");
  });
});
