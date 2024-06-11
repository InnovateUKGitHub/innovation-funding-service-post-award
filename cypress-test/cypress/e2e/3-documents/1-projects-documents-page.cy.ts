import { createTestFile, deleteTestFile } from "common/createTestFile";
import { visitApp } from "../../common/visit";
import {
  deleteDocFromArea,
  displayABFile,
  displayEUIFile,
  displayEUIMedFile,
  downloadMoFile,
  shouldShowProjectTitle,
  uploadToAB,
  uploadToEUI,
  uploadToEUIMed,
  uploadToMO,
} from "./steps";
import { fileTidyUp } from "common/filetidyup";
import {
  learnFiles,
  allowLargerBatchFileUpload,
  validationMessageCumulative,
  validateFileUpload,
  uploadFileTooLarge,
  uploadFileNameTooShort,
  accessControl,
  deleteSingleChar,
  doNotUploadSpecialChar,
  selectFileDescription,
  validateExcessiveFileName,
  uploadSingleChar,
  checkFileUploadSuccessDisappears,
} from "common/fileComponentTests";
import { seconds } from "common/seconds";

describe("Project Documents page", () => {
  before(() => {
    visitApp({ asUser: "testman2@testing.com", path: "projects/a0E2600000kSotUEAS/documents" });
    fileTidyUp("testfile.doc");
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

  it("Should show back to project link", () => {
    cy.backLink("Back to project");
  });

  it("Should display correct project name", shouldShowProjectTitle);

  it("Should show page description and instruction on document uploads", () => {
    cy.paragraph(
      "This page displays documents which are shared with Innovate UK and each project participant. Documents shared here are only accessible to the monitoring officer. Documents shared with the finance contact and project manager (for lead applicant), are accessible only to that participant, Innovate UK and the monitoring officer. When uploading documents, you can choose whether they are accessible by Innovate UK only, or with a participant.",
    );
    cy.paragraph("Do not select a participant if you wish to share the file with Innovate UK only.");
    cy.paragraph(
      "You must upload supporting documents on the page you are submitting your claim or PCR. Do not use this page for claims or PCRs.",
    );
  });

  it("Should display a clickable 'Learn more about files you can upload' message", learnFiles);

  it("Should have an access control drop-down", accessControl);

  it("Should have file description drop-down", selectFileDescription);

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a single file that is too large", uploadFileTooLarge);

  it(
    "Should attempt to upload three files totalling 33MB",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowLargerBatchFileUpload,
  );

  it("Should display the correct validation messaging", validationMessageCumulative);

  it("Should upload a file with a single character as the name", uploadSingleChar);

  it("Should back out and assert that the upload message does NOT persist on other pages after uploading a file.", () =>
    checkFileUploadSuccessDisappears("project", "Project overview"));

  it("Should return to the documents page", () => {
    cy.selectTile("Documents");
    cy.heading("Project documents");
  });

  it("Should delete the file with the very short file name", deleteSingleChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  /**
   * Upload to IUK and MO Only
   */
  it("Should allow for a file to be uploaded under Innovate UK and MO only", uploadToMO);

  it("Should download the file just uploaded under the Innovate UK and MO section", downloadMoFile);

  it("Should then delete the document uploaded to this area", deleteDocFromArea);

  /**
   * Upload to Innovate UK, MO and EUI Small Ent Health
   */
  it("Should allow for a file to be uploaded under Innovate UK, MO and EUI Small Ent Health", uploadToEUI);

  it("Should display the file just uploaded under the Innovate UK and EUI section", displayEUIFile);

  it("Should show the correct partner it is shared with (EUI Small Ent Health)", () => {
    cy.get("tr.govuk-table__row").contains("EUI Small Ent Health");
  });

  it("Should then delete the document uploaded to this area", deleteDocFromArea);

  /**
   * Upload to Innovate UK, MO and A B Cad Services
   */
  it("Should allow for a file to be uploaded under Innovate UK, MO and A B Cad Services", uploadToAB);

  it("Should display the file just uploaded under the Innovate UK and A B Cad section", displayABFile);

  it("Should show the correct partner it is shared with (A B Cad Services)", () => {
    cy.get("tr.govuk-table__row").contains("A B Cad Services");
  });

  it("Should then delete the document uploaded to this area", deleteDocFromArea);

  /**
   * Upload to Innovate UK, MO and ABS EUI Medium Enterprise
   */
  it("Should allow for a file to be uploaded under Innovate UK, MO and ABS EUI Medium Enterprise", uploadToEUIMed);

  it("Should display the file just uploaded under the Innovate UK and ABS section", displayEUIMedFile);

  it("Should show the correct partner it is shared with (ABS EUI Medium Enterprise)", () => {
    cy.get("tr.govuk-table__row").contains("ABS EUI Medium Enterprise");
  });

  it("Should then delete the document uploaded to this area", deleteDocFromArea);
});
