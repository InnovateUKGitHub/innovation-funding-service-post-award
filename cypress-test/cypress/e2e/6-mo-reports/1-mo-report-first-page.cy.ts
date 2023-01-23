import { visitApp } from "../../common/visit";
import {
  clickMoReportTile,
  navigateToProject,
  openHeadingArchivedHeading,
  openReportTable,
  shouldShowProjectTitle,
  startNewReportButton,
} from "./steps";

const moContactEmail = "testman2@testing.com";

describe("MO can navigate to the MO Reports tile", () => {
  before(() => {
    visitApp({ asUser: moContactEmail });

    navigateToProject();
  });

  it("should click the MO Reports tile", clickMoReportTile);

  it("Should have a back link", () => {
    cy.backLink("Back to project");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should display a page heading", () => {
    cy.get("h1").contains("Monitoring reports");
  });

  it("Should have a guidance message", () => {
    cy.getByQA("guidance-message-content").contains("You should submit reports");
  });

  it("Should have a start a new report button", startNewReportButton);

  it("Should have an 'Open' heading and an 'Archived' heading", openHeadingArchivedHeading);

  it("Should display a table to show Open reports", openReportTable);
});
