import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  shouldShowAllAccordion,
  pcrCommentBox,
  characterCount,
  requestHeadingDetailsHeading,
  correctPcrType,
  giveUsInfoTodo,
  explainChangesReasoning,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR >  Add a partner > Create PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create an Add partner PCR", () => {
    cy.createPcr("Add a partner");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", requestHeadingDetailsHeading);

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type", correctPcrType);

  it("Should allow you to add more types of PCR", () => {
    cy.get("a.govuk-link").contains("Add types");
  });

  it(
    "Should show a 'Give us information' section with the Add a partner PCR type listed and 'TO DO' listed beneath",
    giveUsInfoTodo,
  );

  it(
    "Should show an 'Explain why you want to make changes' section with 'Provide reasoning to Innovate UK' listed and displays 'TO DO'",
    explainChangesReasoning,
  );

  it("Should display accordions", shouldShowAllAccordion);

  it("Should have comments box at the bottom of the page and allow text to be entered", pcrCommentBox);

  it("Should count how many characters you have used", characterCount);

  it("Should have a submit request button", () => {
    cy.get("button").contains("Submit request");
  });
});
