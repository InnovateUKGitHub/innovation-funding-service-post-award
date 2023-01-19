import { visitApp } from "../../common/visit";
import { clickMoReportTile, clickStartNewReportButton, navigateToProject, shouldShowProjectTitle } from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO can start a new report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });

    navigateToProject();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should land on the Monitoring report page and display the heading 'Monitoring report'", () => {
    cy.get("h1").contains("Monitoring report");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should have a back link", () => {
    cy.backLink("Back to monitoring reports");
  });

  it("Should have section content with guidance messaging", () => {
    cy.getByQA("section-content").contains("Each report refers to a period");
    cy.getByQA("section-content").contains("For each section score the project");
  });

  it("Should display a period selection box and allow a figure to be entered", () => {
    cy.getByQA("field-period").contains("Period");
    cy.get("input#period").type("1");
  });

  it("Should have a 'Continue' button and a 'Save and return to monitoring reports' button", () => {
    cy.getByQA("button_save-continue-qa").contains("Continue");
    cy.getByQA("button_save-return-qa").contains("Save and return to monitoring reports");
  });
});
