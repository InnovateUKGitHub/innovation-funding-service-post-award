import { visitApp } from "../../common/visit";
import { claimsDocUpload, claimsFileTable, learnFiles, selectFileDescription, shouldShowProjectTitle } from "./steps";

describe("Claims documents upload screen", () => {
  before(() => {
    cy.intercept("POST", "/api/documents/claim-details/*").as("uploadDocument");
    visitApp({ path: "projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1/documents" });
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
    cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
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
    cy.getByQA("button_delete-qa").contains("Remove").click();
  });

  it("Should save and return to claims", () => {
    cy.get("a.govuk-button--secondary").click();
  });
});
