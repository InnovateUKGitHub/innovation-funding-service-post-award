import { visitApp } from "../../common/visit";
import {
  shouldDisplayTwoProjectCards,
  shouldNavigateToProjectDashboard,
  shouldShowAListOfProjectCards,
} from "../1-projects-dashboard/steps";

describe("projects dashboard > general", () => {
  before(() => {
    visitApp({ asUser: (Cypress.env("ITEM_PREFIX") ?? "") + "autoimport.belgium@innovateuk.gov.uk" });
  });

  it("displays two cards", shouldDisplayTwoProjectCards);

  it('should navigate to project dashboard when the "Projects" card is selected', shouldNavigateToProjectDashboard);

  it("should show a list of project cards", shouldShowAListOfProjectCards);
});
