import { visitApp } from "../../common/visit";
import {
  navigateToLoansProject,
  shouldShowAListOfProjectCards,
  shouldNavigateToProjectOverview,
  shouldFindMatchingProjectCard,
} from "./steps";
import { testEach } from "support/methods";

const mo = "testman2@testing.com";

describe("Loans project > dashboard > general", () => {
  before(() => {
    visitApp({ asUser: mo, path: "/projects/dashboard" });
    navigateToLoansProject;
  });

  it("Should show list of project cards", shouldShowAListOfProjectCards);

  it(
    "should navigate to the correct project details page when the project card is clicked",
    shouldNavigateToProjectOverview,
  );

  testEach([
    "Drawdowns",
    "Monitoring reports",
    "Forecast",
    "Project change requests",
    "Documents",
    "Project details",
    "Finance summary",
  ])('should show the "$0" Link', shouldFindMatchingProjectCard);
});
