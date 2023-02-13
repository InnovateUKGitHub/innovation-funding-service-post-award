import { visitApp } from "../../common/visit";
import { testEach } from "../../support/methods";
import { monitoringReportCardShouldNotExist, shouldFindMatchingProjectCard } from "./steps";

const projectManagerFinanceContactEmail = "james.black@euimeabs.test";

describe("projects dashboard > Project Manager - Finance Contact", () => {
  before(() => {
    visitApp({ asUser: projectManagerFinanceContactEmail });

    cy.navigateToProject("328407");
  });

  testEach(["Claims", "Forecast", "Project change requests", "Documents", "Project details", "Finance summary"])(
    'should show the "$0" Link',
    shouldFindMatchingProjectCard,
  );

  it(
    "should not show the Monitoring Reports card to combined Project Manager/Finance Contact",
    monitoringReportCardShouldNotExist,
  );
});
