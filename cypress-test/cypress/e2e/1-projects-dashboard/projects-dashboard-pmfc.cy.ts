import { visitApp } from "../../common/visit";
import { testEach } from "../../support/methods";
import { logInAsUserAndNavigateToProject, monitoringReportCardShouldNotExist } from "./steps";

const projectManagerFinanceContactEmail = "james.black@euimeabs.test";

describe("project dashboard as Project Manager - Finance Contact", () => {
  before(() => {
    visitApp();

    logInAsUserAndNavigateToProject(projectManagerFinanceContactEmail);
  });

testEach([
  "Claims",
  "Forecast",
  "Project change requests",
  "Documents",
  "Project details",
  "Finance summary",
])("should show the \"$0\" Link", (projectCard) => {
  cy.get(".card-link h2").contains(projectCard);
})

  it("should not show the Monitoring Reports card to combined Project Manager/Finance Contact", monitoringReportCardShouldNotExist);
});
