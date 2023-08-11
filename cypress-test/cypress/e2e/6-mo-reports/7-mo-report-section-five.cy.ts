import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  navigateToSection5,
  q5ScoreChoice,
  q5SelectEachRadioButton,
  shouldShowProjectTitle,
  standardComments,
  deleteMoReport,
  assertSectionCommentsAndScore,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > section 5 - can continue a report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });
    cy.navigateToProject("328407");
  });

  after(() => {
    deleteMoReport();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should navigate to section 5", navigateToSection5);

  it("Should have a back link", () => {
    cy.backLink("Back to exploitation");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.heading("Monitoring report");
  });

  it("Should show the period title", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show subheading 'Risk management'", () => {
    cy.get("legend").contains("Risk management");
  });

  it("Should have a number of score options", q5ScoreChoice);

  it("Should be able to select each radio button in turn", q5SelectEachRadioButton);

  it("Should have a subheading above the comment box", () => {
    cy.get("label").contains("Comment");
  });

  it("Should have a text box for submitting comments", () => {
    cy.get("textarea").clear().type(standardComments);
    cy.wait(500);
  });

  it("Should count how many characters you have", characterCount);

  it("Should have a 'Continue' button and a 'Save and return to summary' button", continueAndReturnButtons);

  it("Should navigate back to section 4 and assert the score and text entered previously is saved", () =>
    assertSectionCommentsAndScore("Exploitation", 4));
});
