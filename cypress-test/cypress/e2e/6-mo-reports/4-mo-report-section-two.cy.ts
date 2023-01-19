import { visitApp } from "../../common/visit";
import {
  characterCount,
  clickMoReportTile,
  clickStartNewReportButton,
  continueAndReturnButtons,
  navigateToProject,
  navigateToSection2,
  q2SelectEachRadioButton,
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

  it("Should navigate to section 2", navigateToSection2);

  it("Should show Section 2 of 8 heading", () => {
    cy.get("h3").contains("Section 2 of 8", { timeout: 5000 });
  });

  it("Should have a back link", () => {
    cy.backLink("Back to scope");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show the heading 'Monitoring report'", () => {
    cy.get("h1").contains("Monitoring report", { timeout: 5000 });
  });

  it("Should show the period title", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show subheading 'Time'", () => {
    cy.get("h2").contains("Time");
  });

  it("Should have a number of score options", () => {
    cy.get("label").contains("ahead of schedule");
    cy.get("label").contains("planned timetable");
    cy.get("label").contains("current period have been met");
    cy.get("label").contains("slipped by up to three months");
    cy.get("label").contains("slipped by more than three months");
  });

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
