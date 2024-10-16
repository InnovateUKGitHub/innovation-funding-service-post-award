import { visitApp } from "common/visit";
import { deleteUsingCorrectDeleteButton, validatePeriodBox } from "./steps";
import {
  clickMoReportTile,
  clickStartNewReportButton,
  periodSelection,
  reportGuidance,
  saveContinueSaveReturn,
  shouldShowProjectTitle,
  validateMoReport,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > can start a new report - js-disabled", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: moContactEmail, jsDisabled: true });
    cy.navigateToProject("328407");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should click the 'Start a new report' button", clickStartNewReportButton);

  it("Should land on the Monitoring report page and display the heading 'Monitoring report'", () => {
    cy.heading("Monitoring report");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should have a back link", () => {
    cy.backLink("Back to Monitoring Reports");
  });

  it("Should have section content with guidance messaging", reportGuidance);

  it("Should display a period selection box and allow a figure to be entered", periodSelection);

  it(
    "Should enter an invalid character in the period box and attempt to create, prompting validation",
    validatePeriodBox,
  );

  it("Should have a 'Continue' button and a 'Save and return to monitoring reports' button", saveContinueSaveReturn);

  it(
    "Should 'Save and return' to display the MO Report Summary page and attempt to submit, prompting validation",
    validateMoReport,
  );

  it("Should delete the report asserting for correct Delete button", deleteUsingCorrectDeleteButton);
});
