import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  navigateToProject,
  navigateToSection5,
  q5ScoreChoice,
  q5SelectEachRadioButton,
  shouldShowProjectTitle,
  standardComments,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO can continue a report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });

    navigateToProject();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should navigate to section 5", navigateToSection5);

  it("Should have a back link", () => {
    cy.backLink("Back to exploitation");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.get("h1").contains("Monitoring report", { timeout: 5000 });
  });

  it("Should show the period title", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show subheading 'Risk management'", () => {
    cy.get("h2").contains("Risk management");
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
});
