import { visitApp } from "../../common/visit";
import { shouldShowProjectTitle, shouldShowAllAccordion, pcrCommentBox, characterCount } from "./steps";

describe("Creating Remove a partner PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  it("Should select 'Remove a partner' checkbox", () => {
    cy.clickCheckBox("Remove a partner");
  });

  it("Will click Create request button and proceed to next page", () => {
    cy.submitButton("Create request").click();
    cy.get("h1", { timeout: 10000 }).should("contain.text", "Request", { timeout: 10000 });
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

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
    cy.get("dd.govuk-summary-list__value").contains("Remove a partner");
  });

  it("Should allow you to add more types of PCR", () => {
    cy.get("a.govuk-link").contains("Add types");
  });

  /**
   * TODO Potentially add a step to click into 'Add types' to ensure this function is working and then back out to this page
   */

  it("Should show a 'Give us information' section with the Reallocate costs PCR type listed and 'TO DO' listed beneath", () => {
    cy.get("h2").contains("Give us information");
    // cy.get("span.app-task-list__task-name").contains("Remove a partner");
    // cy.get("strong.govuk-tag.govuk-tag--blue").contains("To do");
    cy.assertPcrCompletionStatus("Remove a partner", "To do");
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
  });

  it("Should have a 'Delete request' link", () => {
    cy.get("a.govuk-link", { timeout: 10000 }).contains("Delete", { timeout: 10000 }).click();
  });

  it("Should have a 'Delete request' button", () => {
    cy.getByQA("button_delete-qa").click();
  });
});
