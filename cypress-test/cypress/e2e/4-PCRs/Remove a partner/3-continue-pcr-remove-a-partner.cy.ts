import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  learnFiles,
  pcrDocUpload,
  pcrFileTable,
  deletePcr,
  clickCreateRequestButtonProceed,
  clickPartnerAddPeriod,
  removePartnerGuidanceInfo,
} from "../steps";

describe("Continuing editing the Remove a partner section once a partner is selected", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
  });

  it("Should select 'Remove a partner' checkbox", () => {
    cy.clickCheckBox("Remove a partner");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should click the Remove partner link to begin editing the PCR", () => {
    cy.get("a").contains("Remove a partner").click();
  });

  it("Should click a partner name before entering a period number and proceeding", clickPartnerAddPeriod);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have the page title 'Remove a partner'", () => {
    cy.get("h1").contains("Remove a partner");
  });

  it("Should have a subheading 'Upload withdrawal of partner certificate'", () => {
    cy.get("h2").contains("Upload withdrawal of partner certificate");
  });

  it("Should have guidance information on what is required", removePartnerGuidanceInfo);

  it("Should display a clickable 'Learn more about files you can upload' message", learnFiles);

  it("should allow you to upload a file", pcrDocUpload);

  it("Should display a document upload validation message", () => {
    cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
  });

  it("Should display the Files uploaded heading", () => {
    cy.get("h2").contains("Files uploaded");
  });

  it("Should display descriptive message", () => {
    cy.get("p.govuk-body").contains("uploaded");
  });

  it("Should show a table of information", pcrFileTable);

  it("Should show the file that's just been uploaded", () => {
    cy.get("a.govuk-link").contains("testfile.doc");
  });

  it("Should allow you to delete the document that was just uploaded", () => {
    cy.getByQA("button_delete-qa").contains("Remove").click();
  });

  it("Should have a 'Save and continue' button", () => {
    cy.submitButton("Save and continue");
  });
});
