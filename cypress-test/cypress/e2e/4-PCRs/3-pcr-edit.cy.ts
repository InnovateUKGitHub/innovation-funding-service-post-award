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

  it("Should delete the PCR just created", () => {
    cy.getByQA("pcrDeleteLink").contains("Delete");
  });

  it("Should have an edit button", () => {
    cy.get("a.govuk-link").contains("Edit").click();
  });
});
