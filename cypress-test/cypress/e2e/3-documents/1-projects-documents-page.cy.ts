import { createTestFile, deleteTestFile } from "common/createTestFile";
import { visitApp } from "../../common/visit";
import {
  accessControl,
  deleteDocFromArea,
  deleteSingleChar,
  displayABFile,
  displayEUIFile,
  displayEUIMedFile,
  displayMOFile,
  doNotUploadSpecialChar,
  learnAboutFiles,
  selectFileDescription,
  shouldShowProjectTitle,
  validateExcessiveFileName,
  uploadSingleChar,
  uploadToAB,
  uploadToEUI,
  uploadToEUIMed,
  uploadToMO,
  validateFileUpload,
  uploadFileTooLarge,
  uploadFileNameTooShort,
} from "./steps";

const docname = "";

describe("Project Documents page", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/documents" });
    createTestFile("bigger_test", 33);
  });

  after(() => {
    deleteTestFile("bigger_test");
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

  it("Should display a clickable 'Learn more about files you can upload' message", learnAboutFiles);

  it("Should have an access control drop-down", accessControl);

  it("Should have file description drop-down", selectFileDescription);

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a file that is too large", uploadFileTooLarge);

  it("Should upload a file with a single character as the name", uploadSingleChar);

  it("Should delete the file with the very short file name", deleteSingleChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  /**
   * Upload to IUK and MO Only
   */
  it("Should allow for a file to be uploaded under Innovate UK and MO only", uploadToMO);

  it("Should display the file just uploaded under the Innovate UK and MO section", displayMOFile);

  it("Should then delete the document uploaded to this area", deleteDocFromArea);

  /**
   * Upload to Innovate UK, MO and EUI Small Ent Health
   */
  it("Should allow for a file to be uploaded under Innovate UK, MO and EUI Small Ent Health", uploadToEUI);

  it("Should display the file just uploaded under the Innovate UK and MO section", displayEUIFile);

  it("Should show the correct partner it is shared with (EUI Small Ent Health)", () => {
    cy.get("tr.govuk-table__row").contains("EUI Small Ent Health");
  });

  it("Should then delete the document uploaded to this area", deleteDocFromArea);

  /**
   * Upload to Innovate UK, MO and A B Cad Services
   */
  it("Should allow for a file to be uploaded under Innovate UK, MO and A B Cad Services", uploadToAB);

  it("Should display the file just uploaded under the Innovate UK and MO section", displayABFile);

  it("Should show the correct partner it is shared with (A B Cad Services)", () => {
    cy.get("tr.govuk-table__row").contains("A B Cad Services");
  });

  it("Should then delete the document uploaded to this area", deleteDocFromArea);

  /**
   * Upload to Innovate UK, MO and ABS EUI Medium Enterprise
   */
  it("Should allow for a file to be uploaded under Innovate UK, MO and ABS EUI Medium Enterprise", uploadToEUIMed);

  it("Should display the file just uploaded under the Innovate UK and MO section", displayEUIMedFile);

  it("Should show the correct partner it is shared with (ABS EUI Medium Enterprise)", () => {
    cy.get("tr.govuk-table__row").contains("ABS EUI Medium Enterprise");
  });

  it("Should then delete the document uploaded to this area", deleteDocFromArea);
});
