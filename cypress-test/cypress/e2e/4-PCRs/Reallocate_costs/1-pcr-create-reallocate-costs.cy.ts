import { visitApp } from "../../../common/visit";
import {
  characterCount,
  explainChangesReasoning,
  pcrCommentBox,
  reallocateCostsGiveInfoTodo,
  reallocateCostsPcrType,
  requestHeadingDetailsHeading,
  shouldShowProjectTitle,
  statusAndCommentsAccordion,
} from "../steps";

import { pcrTidyUp } from "common/pcrtidyup";

const projManager = "james.black@euimeabs.test";

describe("PCR > Reallocate Costs > Creating  PCR", () => {
  before(() => {
    visitApp({ asUser: projManager, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Reallocate project costs");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a Reallocate Partner costs PCR", () => {
    cy.createPcr("Reallocate project costs");
  });

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

  it("Should display accordions", statusAndCommentsAccordion);

  it("Should have comments box at the bottom of the page and allow text to be entered", pcrCommentBox);

  it("Should count how many characters you have used", characterCount);

  it("Should have a submit request button", () => {
    cy.get("button").contains("Submit request");
  });

  it("Should Save and return to requests", () => {
    cy.get("button").contains("Save and return to requests").wait(500).click();
  });

  it("Should return to 'Project change requests' screen and show a 'Delete request' button", () => {
    cy.heading("Project change requests");
    cy.get("a").contains("Delete");
  });
});
