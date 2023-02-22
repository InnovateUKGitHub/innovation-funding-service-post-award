import { visitApp } from "../../../common/visit";
import {
  characterCount,
  clickCreateRequestButtonProceed,
  deletePcr,
  explainChangesReasoning,
  pcrCommentBox,
  reallocateCostsGiveInfoTodo,
  reallocateCostsPcrType,
  requestHeadingDetailsHeading,
  shouldShowAllAccordion,
  shouldShowProjectTitle,
} from "../steps";

import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Reallocate Costs > Creating  PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Reallocate project costs");
  });

  after(deletePcr);

  it("Should select 'Reallocate project costs' checkbox", () => {
    cy.clickCheckBox("Reallocate project costs");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", requestHeadingDetailsHeading);

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type", reallocateCostsPcrType);

  it("Should allow you to add more types of PCR", () => {
    cy.get("a.govuk-link").contains("Add types");
  });

  /**
   * Potentially add a step to click into 'Add types' to ensure this function is working and then back out to this page
   */

  it(
    "Should show a 'Give us information' section with the Reallocate costs PCR type listed and 'TO DO' listed beneath",
    reallocateCostsGiveInfoTodo,
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

  it("Should Save and return to requests", () => {
    cy.getByQA("button_return-qa").contains("Save and return to requests").click();
  });

  it("Should have a 'Delete request' button", () => {
    cy.get("a.govuk-link").contains("Delete");
  });
});
