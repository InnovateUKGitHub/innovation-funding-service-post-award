import { visitApp } from "../../common/visit";
import { backToProject, shouldShowProjectTitle } from "./steps";

describe("PCRs in Draft status can be deleted", () => {
  before(() => {
    visitApp("projects/a0E2600000kSotUEAS/pcrs/dashboard");
  });

  it("Should have a back to project link", backToProject);

  it("Should display the project title", shouldShowProjectTitle);

  it("Should show the Project change requests heading", () => {
    cy.get("h1").contains("Project change requests");
  });

  it("Should a table containing PCRs", () => {
    cy.get("th.govuk-table__header").contains("Request number");
    cy.get("th.govuk-table__header").contains("Types");
    cy.get("th.govuk-table__header").contains("Started");
    cy.get("th.govuk-table__header").contains("Status");
    cy.get("th.govuk-table__header").contains("Last updated");
  });

  it("Should have an edit button", () => {
    cy.get("a.govuk-link").contains("Edit");
  });

  it("Should delete the PCR just created", () => {
    cy.getByQA("pcrDeleteLink").contains("Delete").click();
  });

  it("Should present new page with 'Back to project change requests' link", backToProject);

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show 'Delete draft request' heading", () => {
    cy.get("h1").contains("Delete draft request");
  });

  it("Should show a warning message about permanently deleting", () => {
    cy.get("div.govuk-warning-text").contains("All the information will be permanently deleted");
  });

  it("Should display request information table", () => {
    cy.getByQA("requestNumber").contains("Request number");
    cy.getByQA("types").contains("Types");
    cy.getByQA("started").contains("Started");
    cy.getByQA("lastUpdaed").contains("Last updated");
  });

  it("Should have a 'Delete request' button", () => {
    cy.getByQA("button_delete-qa").click();
  });
});
