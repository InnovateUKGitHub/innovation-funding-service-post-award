import { visitApp } from "../../common/visit";
import { testEach } from "../../support/methods";
import { shouldFindMatchingProjectCard } from "./steps";

const monitoringOfficerEmail = "testman2@testing.com";

describe("projects dashboard > Monitoring Officer", () => {
  before(() => {
    visitApp({ asUser: monitoringOfficerEmail });

    cy.navigateToProject();
  });

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
