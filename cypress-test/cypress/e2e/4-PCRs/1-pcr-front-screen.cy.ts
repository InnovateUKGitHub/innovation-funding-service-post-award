import { visitApp } from "../../common/visit";
import {
  backToProject,
  beforeYouSubmit,
  createRequestButton,
  explainPCRTypes,
  pcrCheckBoxes,
  shouldShowProjectTitle,
} from "./steps";

describe("Project Change Request front page", () => {
  before(() => {
    visitApp("projects/a0E2600000kSotUEAS/pcrs/dashboard");
  });

  it("Should show back to project link", backToProject);

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a page heading", () => {
    cy.get("h1").contains("Project change requests");
  });

  it("Should have a Create request button and will allow you to start a PCR", createRequestButton);
});

describe("Start a new request screen loads", () => {
  it("Should display the project title", shouldShowProjectTitle);

  it("Should show the page title", () => {
    cy.get("h1").contains("Start a new request");
  });

  it("Should display a 'before you submit' message", beforeYouSubmit);

  it("Should contain Select request types heading", () => {
    cy.get("h2").contains("Select request types");
  });

  it("Should have information on the different types of PCR", () => {
    cy.get("p.govuk-hint.govuk-body").contains("Project Change Request");
  });

  it("Should have a 'Learn more about request types' section", () => {
    cy.get("span.govuk-details__summary-text").contains("Learn more about request types").click();
  });

  it("Should expand and show details on the different PCR types", explainPCRTypes);

  it("Should allow you to check the checkboxes", pcrCheckBoxes);

  it("Has a Create request button", () => {
    cy.getByQA("button_default-qa").contains("Create request");
  });

  it("Has a Cancel button", () => {
    cy.get("a.govuk-button--secondary").contains("Cancel");
  });
});