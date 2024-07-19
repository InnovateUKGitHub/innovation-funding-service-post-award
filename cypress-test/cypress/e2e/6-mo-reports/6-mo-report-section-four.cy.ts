import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  navigateToSection4,
  q4ScoreChoice,
  q4SelectEachRadioButton,
  shouldShowProjectTitle,
  standardComments,
  deleteMoReport,
  assertSectionCommentsAndScore,
  validateMORSection,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > section 4 - can continue a report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });
    cy.navigateToProject("328407");
  });

  after(() => {
    deleteMoReport();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should navigate to section 4", navigateToSection4);

  it("Should have a back link", () => {
    cy.backLink("Back to cost");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.heading("Monitoring report");
  });

  it("Should show the period title", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show subheading 'Exploitation'", () => {
    cy.get("legend").contains("Exploitation");
  });

  it("Should have a number of score options", q4ScoreChoice);

  it("Should be able to select each radio button in turn", q4SelectEachRadioButton);

  it("Should have a subheading above the comment box", () => {
    cy.get("label").contains("Comment");
  });

  it("Should validate maximum number of characters", () => validateMORSection("4", "exploitation", true));

  it("Should clear the text box and enter standard", () => {
    cy.get("textarea").clear().type(standardComments);
    cy.wait(500);
  });

  it("Should count how many characters you have", characterCount);

  it("Should have a 'Continue' button and a 'Save and return to summary' button", continueAndReturnButtons);

  it("Should navigate back to section 3 and assert the score and text entered previously is saved", () =>
    assertSectionCommentsAndScore("Cost", 3));
});
