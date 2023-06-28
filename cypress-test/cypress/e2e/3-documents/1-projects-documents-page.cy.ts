import { visitApp } from "../../common/visit";
import {
  accessControl,
  deleteDocFromArea,
  displayABFile,
  displayEUIFile,
  displayEUIMedFile,
  displayMOFile,
  learnAboutFiles,
  selectFileDescription,
  shouldShowProjectTitle,
  uploadToAB,
  uploadToEUI,
  uploadToEUIMed,
  uploadToMO,
  validateFileUpload,
} from "./steps";

const docname = "";

describe("Project Documents page", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/documents" });
  });

  it("Should show back to project link", () => {
    cy.backLink("Back to project");
  });

  it("Should display correct project name", shouldShowProjectTitle);

  it("Should show page description and instruction on document uploads", () => {
    cy.get("p").contains(
      "This page displays documents which are shared with Innovate UK and each project participant.",
    );
  });

  it("Should display a clickable 'Learn more about files you can upload' message", learnAboutFiles);

  it("Should have an access control drop-down", accessControl);

  it("Should have file description drop-down", selectFileDescription);

  it("Should validate when uploading without choosing a file as well as special characters", validateFileUpload);

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
