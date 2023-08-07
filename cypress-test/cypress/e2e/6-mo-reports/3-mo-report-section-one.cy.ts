import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  periodSelection,
  q1ScoreChoice,
  q1SelectEachRadioButton,
  shouldShowProjectTitle,
  standardComments,
  deleteMoReport,
  saveSectionOneAndCheckSummary,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > section 1 - can continue a report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });
    cy.navigateToProject("328407");
  });

  after(() => {
    deleteMoReport();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should display a period selection box and allow a figure to be entered", periodSelection);

  it("Should continue to the next page", () => {
    cy.button("Continue").click();
  });

  it("Should show the period number", () => {
    cy.get("h2").contains("Period 1");
  });

  it("Should have a back link", () => {
    cy.backLink("Back to Monitoring Reports");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.heading("Monitoring report");
  });

  it("Should show Section 1 of 8 heading", () => {
    cy.get("h3").contains("Section 1 of 8");
  });

  it("Should show subheading 'Scope'", () => {
    cy.get("Legend").contains("Scope");
  });

  it("Should have a paragraph with guidance on how to complete the report", () => {
    cy.get("#hint-for-questions").contains("For each question score the project");
  });

  it("Should have a number of score options", q1ScoreChoice);

  it("Should be able to select each radio button in turn", q1SelectEachRadioButton);

  it("Should have a subheading above the comment box", () => {
    cy.get("label").contains("Comment");
  });

  it("Should have a text box for submitting comments", () => {
    cy.get("textarea").clear().type(standardComments);
    cy.wait(500);
  });

  it("Should count how many characters you have", characterCount);

  it("Should have a 'Continue' button and a 'Save and return to summary' button", continueAndReturnButtons);

  it(
    "Should click 'Save and return to summary' and assert the completed section appears in the summary correctly",
    saveSectionOneAndCheckSummary,
  );
});
