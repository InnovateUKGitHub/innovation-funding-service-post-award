import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";
import {
  shouldShowProjectTitle,
  pcrCommentBox,
  characterCount,
  requestHeadingDetailsHeading,
  removePartnerPcrType,
  removePartnerGiveInfoTodo,
  explainChangesReasoning,
  statusAndCommentsLog,
} from "../steps";

describe("js-disabled > PCR > Remove partner > Creating PCR", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", jsDisabled: true });
    pcrTidyUp("Draft");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a Remove partner PCR", () => {
    cy.createPcr("Remove a partner", { jsDisabled: true });
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", requestHeadingDetailsHeading);

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type", removePartnerPcrType);

  it("Should allow you to add more types of PCR", () => {
    cy.get("a.govuk-link").contains("Add types");
  });

  /**
   * TODO Potentially add a step to click into 'Add types' to ensure this function is working and then back out to this page
   */

  it(
    "Should show a 'Give us information' section with the Remove a partner PCR type listed and 'TO DO' listed beneath",
    removePartnerGiveInfoTodo,
  );

  it(
    "Should show an 'Explain why you want to make changes' section with 'Provide reasoning to Innovate UK' listed and displays 'TO DO'",
    explainChangesReasoning,
  );

  it("Should display status and comments log", statusAndCommentsLog);

  it("Should have comments box at the bottom of the page and allow text to be entered", pcrCommentBox);

  it("Should have a submit request button", () => {
    cy.get("button").contains("Submit request");
  });
});
