import { visitApp } from "../../common/visit";
import {
  clickMoReportTile,
  clickStartNewReportButton,
  periodSelection,
  reportGuidance,
  saveContinueSaveReturn,
  shouldShowProjectTitle,
} from "./steps";
import { moReportTidyup } from "common/mo-report-tidyup";

const moContactEmail = "testman2@testing.com";

describe("MO report > can start a new report", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });
    moReportTidyup("Draft");
    cy.navigateToProject("328407");
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

  it("Should have section content with guidance messaging", reportGuidance);

  it("Should display a period selection box and allow a figure to be entered", periodSelection);

  it("Should have a 'Continue' button and a 'Save and return to monitoring reports' button", saveContinueSaveReturn);
});
