import { visitApp } from "../../common/visit";
import { testEach } from "../../support/methods";
import { logInAsUserAndNavigateToProject } from "./steps";

const monitoringOfficerEmail = "testman2@testing.com";

describe("project dashboard as Monitoring Officer", () => {
  before(() => {
    visitApp();

    logInAsUserAndNavigateToProject(monitoringOfficerEmail);
  });

  testEach([
    "Claims",
    "Monitoring reports",
    "Forecast",
    "Project change requests",
    "Documents",
    "Project details",
    "Finance summary",
  ])("should show the \"$0\" Link", (projectCard) => {
    cy.get(".card-link h2").contains(projectCard);
  })
});
