import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  navigateToSection2,
  q2ScoreChoice,
  q2SelectEachRadioButton,
  shouldShowProjectTitle,
  standardComments,
  deleteMoReport,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > section 2 - can continue a report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });
    cy.navigateToProject("328407");
  });

  after(() => {
    deleteMoReport();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should navigate to section 2", navigateToSection2);

  it("Should show Section 2 of 8 heading", () => {
    cy.get("h3").contains("Section 2 of 8");
  });

  it("Should have a back link", () => {
    cy.backLink("Back to scope");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.heading("Monitoring report");
  });

  it("Should show the period title", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show subheading 'Time'", () => {
    cy.get("h2").contains("Time");
  });

  it("Should have a number of score options", q2ScoreChoice);

  it("Should be able to select each radio button in turn", q2SelectEachRadioButton);

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
