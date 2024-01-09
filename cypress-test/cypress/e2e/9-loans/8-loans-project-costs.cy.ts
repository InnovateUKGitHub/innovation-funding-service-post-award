import { visitApp } from "common/visit";
import { shouldShowProjectTitle } from "e2e/2-claims/steps";
import {
  costCatTable,
  projCostsCostHeaders,
  projCostsDownload,
  projCostsDrawdownTable,
  projCostsFileUpload,
  projCostsPeriodTable,
  projCostsSelectFileDescription,
  projCostsStatusSection,
  projCostsUploadedSection,
} from "./steps";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import { deleteDocFromArea } from "e2e/3-documents/steps";
import { fileTidyUp } from "common/filetidyup";
import { learnFiles } from "common/fileComponentTests";
import {
  validateFileUpload,
  uploadFileTooLarge,
  uploadSingleChar,
  deleteSingleChar,
  uploadFileNameTooShort,
  validateExcessiveFileName,
  doNotUploadSpecialChar,
  allowLargerBatchFileUpload,
} from "common/fileComponentTests";
import { seconds } from "common/seconds";

const fc = "s.shuang@irc.trde.org.uk.test";
describe("Loans > Project Costs & Documents", () => {
  before(() => {
    visitApp({ asUser: fc });
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
    cy.navigateToProject("191431");
  });

  after(() => {
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should click the Project Costs tile", () => {
    cy.selectTile("Project Costs");
  });

  it("Should display the Project Costs heading and Open/Closed subheadings", () => {
    cy.heading("Project costs");
    cy.get("h2").contains("Open");
    cy.get("h2").contains("Closed");
  });

  it("Should have a backlink", () => {
    cy.backLink("Back to project");
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should display the Project Costs period table", projCostsPeriodTable);

  it("Should access the EUI Project Cost", () => {
    cy.get("a").contains("Edit").click();
    cy.heading("Costs for this period");
  });

  it("Should display claim retention information", () => {
    cy.validationNotification(
      "Please be aware, approval of this claim will cause a percentage of your grant to be retained. Innovate UK will retain a portion of the grant value due for this project until the project is completed (as per the terms & conditions of your grant offer letter). To check your current retained balance, please see the financial summary area of your project dashboard.",
    );
  });

  it("Should show the correct table headers for cost category table", projCostsCostHeaders);

  it("Should display the cost category table for a loans project", costCatTable);

  it("Should show a drawdown table", projCostsDrawdownTable);

  it("Should display a status and comments log section", projCostsStatusSection);

  it("Should have a 'Save and return to project costs button' and click the 'Continue to costs documents' button", () => {
    cy.getByRole("button", "Save and return to project costs");
    cy.clickOn("Continue to costs documents");
  });

  it("Should display the 'Supporting evidence' heading and subheadings", () => {
    cy.heading("Supporting evidence");
    cy.get("h2").contains("Upload");
    cy.get("h2").contains("Files uploaded");
  });

  it("Should have a backlink", () => {
    cy.backLink("Back to costs to be claimed");
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should check for existing files and clean up where needed", () => fileTidyUp("testfile.doc"));

  it("Should have a 'Learn more about files you can upload' section", learnFiles);

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a single file that is too large", uploadFileTooLarge);
  it(
    "Should attempt to upload three files totalling 33MB",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowLargerBatchFileUpload,
  );

  it("Should upload a file with a single character as the name", uploadSingleChar);

  it("Should delete the file with the very short file name", deleteSingleChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  it("Should ensure the File description is working correctly.", projCostsSelectFileDescription);

  it("Should upload a file", projCostsFileUpload);

  it("Should correctly display the file", projCostsUploadedSection);

  it("Should download the file", projCostsDownload);

  it("Should delete the document", deleteDocFromArea);

  it("Should have a 'Save and return to project costs' button and click the 'Continue to update forecast' button", () => {
    cy.get("a").contains("Save and return to project costs");
    cy.get("a").contains("Continue to update forecast").click();
  });

  it("Should display the Update forecast heading", () => {
    cy.heading("Update forecast");
  });
});
