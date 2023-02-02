import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  shouldShowAllAccordion,
  pcrCommentBox,
  characterCount,
  deletePcr,
  clickCreateRequestButtonProceed,
  requestHeadingDetailsHeading,
  removePartnerPcrType,
  removePartnerGiveInfoTodo,
  explainChangesReasoning,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Remove partner > Creating PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Remove a partner");
  });

  after(() => {
    deletePcr();
  });

  it("Should select 'Remove a partner' checkbox", () => {
    cy.clickCheckBox("Remove a partner");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

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

  it("Should display accordions", shouldShowAllAccordion);

  it("Should have comments box at the bottom of the page and allow text to be entered", pcrCommentBox);

  it("Should count how many characters you have used", characterCount);

  it("Should have a submit request button", () => {
    cy.getByQA("button_default-qa").contains("Submit request");
  });
});
