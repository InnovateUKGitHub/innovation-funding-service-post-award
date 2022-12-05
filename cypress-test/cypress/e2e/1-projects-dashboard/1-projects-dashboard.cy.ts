import { visitApp } from "../../common/visit";
import { testEach } from "../../support/methods";
import {
  shouldDisplayTwoProjectCards,
  shouldFilterProjectsUsingCheckboxes,
  shouldFilterProjectsUsingSearchFilter,
  shouldFindMatchingProjectCard,
  shouldNavigateToProjectDashboard,
  shouldNavigateToProjectOverview,
  shouldShowAListOfProjectCards,
} from "./steps";

describe("projects dashboard", () => {
  before(() => {
    visitApp();
  });

  it("displays two cards", shouldDisplayTwoProjectCards);

  it('should navigate to project dashboard when the "Projects" card is selected', shouldNavigateToProjectDashboard);

  it("should show a list of project cards", shouldShowAListOfProjectCards);

  testEach([
    ["PCR's being queried", "Project change request queried"],
    ["Claims to review", "Claims to review"],
    ["PCR's to review", "Project change requests to review"],
    ["Not completed setup", "You need to set up your project"],
    ["Claims to submit", "You need to submit your claim."],
    ["Claims needing responses", "Claim queried"],
  ])(`should have a $0 filter`, shouldFilterProjectsUsingCheckboxes);

  it("should have a filter search button that will filter the projects", shouldFilterProjectsUsingSearchFilter);

  it(
    "should navigate to the correct project details page when the project card is clicked",
    shouldNavigateToProjectOverview,
  );

  testEach([
    "Claims",
    "Monitoring reports",
    "Forecast",
    "Project change requests",
    "Documents",
    "Project details",
    "Finance summary",
  ])('should show the "$0" Link', shouldFindMatchingProjectCard);
});
