import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  navigateToSection6,
  q6ScoreChoice,
  q6SelectEachRadioButton,
  shouldShowProjectTitle,
  standardComments,
  deleteMoReport,
} from "./steps";
import { moReportTidyup } from "common/mo-report-tidyup";

const moContactEmail = "testman2@testing.com";

describe("MO report > section 6 - can continue a report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });
    cy.navigateToProject("328407");
    moReportTidyup("Draft");
  });

  after(() => {
    deleteMoReport();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should navigate to section 6", navigateToSection6);

  it("Should have a back link", () => {
    cy.backLink("Back to risk management");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.get("h1").contains("Monitoring report");
  });

  it("Should show the period title", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show subheading 'Project planning'", () => {
    cy.get("h2").contains("Project planning");
  });

  it("Should have a number of score options", q6ScoreChoice);

  it("Should be able to select each radio button in turn", q6SelectEachRadioButton);

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
