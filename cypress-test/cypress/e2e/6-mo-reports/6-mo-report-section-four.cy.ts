import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  navigateToProject,
  navigateToSection4,
  q4SelectEachRadioButton,
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

  it("Should navigate to section 4", navigateToSection4);

  it("Should have a back link", () => {
    cy.backLink("Back to cost");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.get("h1").contains("Monitoring report", { timeout: 5000 });
  });

  it("Should show the period title", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show subheading 'Exploitation'", () => {
    cy.get("h2").contains("Exploitation");
  });

  it("Should have a number of score options", () => {
    cy.get("label").contains("Exceeding expectations");
    cy.get("label").contains("Good");
    cy.get("label").contains("Scope for improvement");
    cy.get("label").contains("Very poor");
    cy.get("label").contains("Unacceptable");
  });

  it("Should be able to select each radio button in turn", q4SelectEachRadioButton);

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