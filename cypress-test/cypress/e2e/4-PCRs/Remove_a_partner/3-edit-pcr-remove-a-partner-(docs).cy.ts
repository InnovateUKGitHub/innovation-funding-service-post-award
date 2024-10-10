import { Intercepts } from "common/intercepts";
import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  pcrDocUpload,
  removePartnerFileTable,
  clickPartnerAddPeriod,
  removePartnerGuidanceInfo,
  removeFileDelete,
} from "../steps";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import { pcrTidyUp } from "common/pcrtidyup";

const pmEmail = "james.black@euimeabs.test";

describe("PCR > Remove partner > Continuing editing the Remove a partner section once a partner is selected", () => {
  before(() => {
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("328407");
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
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

  it("Should test the file components", () => {
    cy.testFileComponent(
      "James Black",
      "request",
      "Request",
      "Remove a partner",
      Intercepts.PCR,
      false,
      true,
      false,
      false,
      "Documents",
    );
  });

  it("Should allow a single file upload", pcrDocUpload);

  it("Should display a document upload validation message", () => {
    cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
  });

  it("Should display the Files uploaded heading", () => {
    cy.get("h2").contains("Files uploaded");
  });

  it("Should display descriptive message", () => {
    cy.get("p.govuk-body").contains("uploaded");
  });

  it("Should show a table of information", removePartnerFileTable);

  it("Should show the file that's just been uploaded", () => {
    cy.get("a.govuk-link").contains("testfile.doc");
  });

  it("Should allow you to delete the document that was just uploaded", removeFileDelete);

  it("Should have a 'Save and continue' button", () => {
    cy.submitButton("Save and continue");
  });

  it("Should have a working back link", () => {
    cy.backLink("Back to request").click();
    cy.heading("Request");
  });
});
