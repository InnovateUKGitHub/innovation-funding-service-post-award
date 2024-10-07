import { visitApp } from "common/visit";
import {
  clickMoReportTile,
  openHeadingArchivedHeading,
  openReportTable,
  shouldShowProjectTitle,
  startNewReportButton,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO report > can navigate to the MO Reports tile - js-disabled", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: moContactEmail, jsDisabled: true });

    cy.navigateToProject("328407");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should have a back link", () => {
    cy.backLink("Back to project");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should display a page heading", () => {
    cy.heading("Monitoring reports");
  });

  it("Should have a guidance message", () => {
    cy.getByQA("guidance-message-content").contains("You should submit reports");
  });

  it("Should have a start a new report button", startNewReportButton);

  it("Should have an 'Open' heading and an 'Archived' heading", openHeadingArchivedHeading);

  it("Should display a table to show Open reports", openReportTable);
});
