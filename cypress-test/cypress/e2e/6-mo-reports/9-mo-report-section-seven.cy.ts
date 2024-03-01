import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  navigateToSection7,
  shouldShowProjectTitle,
  standardComments,
  deleteMoReport,
  assertSectionCommentsAndScore,
  validateMoCommentBoxMaximum,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > section 7 - can continue a report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });
    cy.navigateToProject("328407");
  });

  after(() => {
    deleteMoReport();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should navigate to section 7", navigateToSection7);

  it("Should have a back link", () => {
    cy.backLink("Back to project planning");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.heading("Monitoring report");
  });

  it("Should show the period title", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show subheading 'Summary'", () => {
    cy.get("legend").contains("Summary");
  });

  it("Should contain summary guidance", () => {
    cy.get("#hint-for-questions").contains(
      "Please summarise the project's key achievements and the key issues and risks that it faces.",
    );
  });

  it("Should have a subheading above the comment box", () => {
    cy.get("label").contains("Comment");
  });

  it("Should validate maximum number of characters", validateMoCommentBoxMaximum);

  it("Should clear the text box and enter standard", () => {
    cy.get("textarea").clear().type(standardComments);
    cy.wait(500);
  });

  it("Should count how many characters you have", characterCount);

  it("Should have a 'Continue' button and a 'Save and return to summary' button", continueAndReturnButtons);
  it("Should navigate back to section 6 and assert the score and text entered previously is saved", () =>
    assertSectionCommentsAndScore("Project planning", 6));
});
