import { visitApp } from "../../../common/visit";
import { shouldShowProjectTitle, learnFiles, pcrDocUpload, deletePcr } from "../steps";

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

  it("Will click Create request button and proceed to next page", () => {
    cy.submitButton("Create request").click();
    cy.get("h1", { timeout: 14000 }).should("contain.text", "Request", { timeout: 14000 });
  });

  it("Should click the Remove partner link to begin editing the PCR", () => {
    cy.get("a").contains("Remove a partner").click();
  });

  it("Should click a partner name before entering a period number and proceeding", () => {
    cy.getByLabel("EUI Small Ent Health").click();
    cy.get(`input[id="removalPeriod"]`).clear().type("3");
    cy.submitButton("Save and continue").click();
  });

  it("should allow you to upload a file", pcrDocUpload);

  it("Should have a 'Save and continue' button", () => {
    cy.submitButton("Save and continue").click();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have the page title 'Remove a partner'", () => {
    cy.get("h1").contains("Remove a partner");
  });

  it("Should display a remove partner table containing information on the request entered so far", () => {
    cy.getByQA("partnerToRemove").contains("Partner being removed");
    cy.getByQA("removalPeriod").contains("Last period");
    cy.getByQA("supportingDocuments").contains("Documents");
  });

  it("Has a subheading 'Mark as complete' with an 'I agree with this change' checkbox", () => {
    cy.get("h2").contains("Mark as complete");
    cy.clickCheckBox("I agree with this change");
  });

  it("Should save and return to request", () => {
    cy.submitButton("Save and return to request").click();
  });

  it("Should show that the first section has completed", () => {
    cy.get("strong", { timeout: 10000 }).contains("Complete");
  });
});
