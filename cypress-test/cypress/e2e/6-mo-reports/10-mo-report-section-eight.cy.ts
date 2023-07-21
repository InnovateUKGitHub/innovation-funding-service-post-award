import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  navigateToSection8,
  shouldShowProjectTitle,
  standardComments,
  deleteMoReport,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > section 8 - can continue a report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });
    cy.navigateToProject("328407");
  });

  after(() => {
    deleteMoReport();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should navigate to section 8", navigateToSection8);

  it("Should have a back link", () => {
    cy.backLink("Back to summary");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.heading("Monitoring report");
  });

  it("Should show the period title", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show subheading 'Issues and actions'", () => {
    cy.get("legend").contains("Issues and actions");
  });

  it("Should contain guidance on any issues and actions", () => {
    cy.get("#hint-for-questions").contains(
      "Please confirm any specific issues that require Technology Strategy Board intervention - e.g. apparent scope change, partner changes, budget virements or time extensions.",
    );
  });

  it("Should have a subheading above the comment box", () => {
    cy.get("label").contains("Comment");
  });

  it("Should have a text box for submitting comments", () => {
    cy.get("textarea").clear().type(standardComments);
    cy.wait(500);
  });

  it("Should count how many characters you have", characterCount);

  it("Should have a 'Continue' button and a 'Save and return to summary' button", continueAndReturnButtons);
});
