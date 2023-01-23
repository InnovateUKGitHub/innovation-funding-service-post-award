import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  pcrDocUpload,
  deletePcr,
  clickCreateRequestButtonProceed,
  clickPartnerAddPeriod,
  removePartnerTable,
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

  it("Should display a remove partner table containing information on the request entered so far", removePartnerTable);

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
