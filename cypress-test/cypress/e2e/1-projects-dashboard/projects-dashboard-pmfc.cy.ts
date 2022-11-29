import { visitApp } from "../../common/visit";
import { logInAsUserAndNavigateToProject, monitoringReportCardShouldNotExist } from "./steps";

const projectManagerFinanceContactEmail = "james.black@euimeabs.test";

describe("project dashboard as Project Manager - Finance Contact", () => {
  before(() => {
    visitApp();

    logInAsUserAndNavigateToProject(projectManagerFinanceContactEmail);
  });

  const expectedProjectCards = [
    "Claims",
    "Forecast",
    "Project change requests",
    "Documents",
    "Project details",
    "Finance summary",
  ];
  expectedProjectCards.forEach(projectCard => {
    it(`should show the "${projectCard}" Link`, () => {
      cy.get(".card-link h2").contains(projectCard);
    });
  });

  it("should not show the Monitoring Reports card to combined Project Manager/Finance Contact", monitoringReportCardShouldNotExist);
});
