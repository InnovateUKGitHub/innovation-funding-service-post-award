import { visitApp } from "../../../common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  shouldShowProjectTitle,
  requestHeadingDetailsHeading,
  changeNamePcrType,
  learnFiles,
  tickEachPartner,
  saveContinueProceed,
  uploadNameChange,
  showUploadedFiles,
  summaryOfChanges,
  assertChangeNamePage,
  completeChangeName,
  changeNameHeadings,
} from "../steps";

const projectManager = "james.black@euimeabs.test";

describe("PCR >  Change a partner's name > Create PCR", () => {
  before(() => {
    visitApp({ asUser: projectManager, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Change a partner's name");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should select the correct tick box and start a new 'Change a partner's name' PCR", () => {
    cy.clickCheckBox("Change a partner's name");
    cy.getByQA("button_default-qa").contains("Create request").click();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", requestHeadingDetailsHeading);

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type and continue to begin the PCR", changeNamePcrType);

  it("Should click Change a partner's name and continue", () => {
    cy.get("a").contains("Change a partner's name").click();
  });

  it("Should contain the PCR title, correct project title and back button", changeNameHeadings);

  it("Should contain guidance information and tick each list item of partners", tickEachPartner);

  it("Should allow you to enter the new name", () => {
    cy.get("h2").contains("Enter new name");
    cy.get('input[id="accountName"]').wait(500).type("Munce Inc");
  });

  it("Should click the save and continue button to proceed", saveContinueProceed);

  it("Should contain a 'Learn more about files you can upload' section", learnFiles);

  it("Should show a files uploaded area with no files", () => {
    cy.get("h2").contains("Files uploaded");
    cy.get("p").contains("No documents uploaded.");
  });

  it("Should upload a file", uploadNameChange);

  it("Should now show the files uploaded", showUploadedFiles);

  it("Should delete the file and display the correct validation message", () => {
    cy.getByQA("button_delete-qa").contains("Remove").click();
    cy.getByQA("validation-message-content").contains("Your document has been removed.");
  });

  it("Should upload another file and click 'Save and continue'", () => {
    cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
    cy.getByQA("button_uploadFileAndContinue-qa").contains("Save and continue").click();
  });

  it("Should display a summary of changes", summaryOfChanges);

  it("Should again display the PCR title, correct project title and back button", assertChangeNamePage);

  it("Should have a mark as complete section and click the tick box before saving and returning", completeChangeName);
});
