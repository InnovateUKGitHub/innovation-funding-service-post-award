import { visitApp } from "../../common/visit";
import {
  backToProject,
  characterCount,
  deletePcr,
  pcrCommentBox,
  shouldShowAllAccordion,
  shouldShowProjectTitle,
} from "./steps";

describe("Creating Reallocate Project Costs PCR", () => {
  before(() => {
    // cy.intercept("POST", "/projects/*/pcrs/*/prepare").as("pcrPrepare");
    visitApp("projects/a0E2600000kSotUEAS/pcrs/create");
  });

  after(deletePcr);

  it("Should select 'Reallocate project costs' checkbox", () => {
    cy.clickCheckBox("Reallocate project costs");
  });

  it("Will click Create request button and proceed to next page", () => {
    cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
    cy.submitButton("Create request").click();
    cy.wait("@pcrPrepare");
    cy.get("h1").should("contain.text", "Request");
  });

  it("Should show back to project link", backToProject);

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", () => {
    cy.get("h1").contains("Request");
    cy.get("h2").contains("Details");
  });

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type", () => {
    cy.get("dt.govuk-summary-list__key").contains("Types");
    cy.get("dd.govuk-summary-list__value").contains("Reallocate project costs");
  });

  it("Should allow you to add more types of PCR", () => {
    cy.get("a.govuk-link").contains("Add types");
  });

  /**
   * Potentially add a step to click into 'Add types' to ensure this function is working and then back out to this page
   */

  it("Should show a 'Give us information' section with the Reallocate costs PCR type listed and 'TO DO' listed beneath", () => {
    cy.get("h2.app-task-list__section").contains("Give us information");
    cy.get("span.app-task-list__task-name").contains("Reallocate project costs");
    cy.get("strong.govuk-tag.govuk-tag--blue").contains("To do");
  });

  it("Should show an 'Explain why you want to make changes' section with 'Provide reasoning to Innovate UK' listed and displays 'TO DO'", () => {
    cy.get("h2.app-task-list__section").contains("Explain why you want to make the changes");
    cy.get("span.app-task-list__task-name").contains("Provide reasoning to Innovate UK");
    cy.get("strong.govuk-tag.govuk-tag--blue").contains("To do");
  });

  it("Should display accordions", shouldShowAllAccordion);

  it("Should have comments box at the bottom of the page and allow text to be entered", pcrCommentBox);

  it("Should count how many characters you have used", characterCount);

  it("Should have a submit request button", () => {
    cy.getByQA("button_default-qa").contains("Submit request");
  });

  it("Should Save and return to requests", () => {
    cy.getByQA("button_return-qa").contains("Save and return to requests").click();
    cy.wait(5000);
  });

  it("Should have a 'Delete request' button", () => {
    cy.get("a.govuk-link").contains("Delete");
  });
});
