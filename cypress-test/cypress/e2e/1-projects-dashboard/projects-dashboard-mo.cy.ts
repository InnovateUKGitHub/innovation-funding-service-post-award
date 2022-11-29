import { visitApp } from "../../common/visit";
import { logInAsUserAndNavigateToProject } from "./steps";

const monitoringOfficerEmail = "testman2@testing.com";

describe("project dashboard as Monitoring Officer", () => {
  before(() => {
    visitApp();

    logInAsUserAndNavigateToProject(monitoringOfficerEmail);
  });

  const expectedProjectCards = [
    "Claims",
    "Monitoring reports",
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
});
