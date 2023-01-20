import { visitApp } from "../../../common/visit";
import { shouldShowProjectTitle, deletePcr, completeNewPartnerInfoNonAid } from "../steps";

describe("Creating Remove a partner PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
  });

  it("Should select 'Add a partner' checkbox", () => {
    cy.clickCheckBox("Add a partner");
  });

  it("Will click Create request button and proceed to next page", () => {
    cy.submitButton("Create request").click();
  });

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner", { timeout: 10000 }).click();
  });

  it("Should complete this page as a business and continue to the next page", completeNewPartnerInfoNonAid);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading and 'Non-aid funding' heading", () => {
    cy.get("h1").contains("Add a partner", { timeout: 10000 });
    cy.get("h2").contains("Non-aid funding", { timeout: 10000 });
  });

  it("Should have further information on state aid eligibility", () => {
    cy.get("p").contains("This competition provides funding that is classed as non-aid");
    cy.get("p").contains("Non-aid is only granted to organisations which declare");
    cy.get("p").contains("in any way which gives them");
    cy.get("p").contains("in any other way which would");
  });

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", () => {
    cy.submitButton("Save and continue");
    cy.submitButton("Save and return to summary");
  });
});
