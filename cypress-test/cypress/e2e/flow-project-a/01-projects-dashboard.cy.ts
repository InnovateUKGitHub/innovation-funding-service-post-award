import { visitApp } from "../../common/visit";
import { shouldDisplayTwoProjectCards, shouldNavigateToProjectDashboard } from "../1-projects-dashboard/steps";

describe("projects dashboard > general", () => {
  before(() => {
    visitApp({ asUser: (Cypress.env("ITEM_PREFIX") ?? "") + "autoimport.belgium@innovateuk.gov.uk" });
  });

  it("displays two cards", shouldDisplayTwoProjectCards);

  it('should navigate to project dashboard when the "Projects" card is selected', shouldNavigateToProjectDashboard);

  it("should show our project", () => {
    cy.get('[data-qa="pending-and-open-projects"] .acc-list-item').contains("ACC-9810 / KTP Project");
  });
});
