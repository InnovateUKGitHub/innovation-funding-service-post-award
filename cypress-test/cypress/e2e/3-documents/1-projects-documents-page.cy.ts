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
import { accessControl, selectFileDescription } from "common/fileComponentTests";
import { Intercepts } from "common/intercepts";

describe("Project Documents page", () => {
  before(() => {
    visitApp({ asUser: "testman2@testing.com", path: "projects/a0E2600000kSotUEAS/documents" });
    cy.fileTidyUp("testfile.doc");
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

  it("Should have an access control drop-down", accessControl);

  it("Should have file description drop-down", selectFileDescription);

  it("Should test the file components", () => {
    cy.testFileComponent(
      "Javier Baez",
      "project",
      "Project overview",
      "Documents",
      Intercepts.project,
      true,
      false,
      false,
    );
  });

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
