import { visitApp } from "../../common/visit";
import { testEach } from "../../support/methods";
import { logInAsUserAndNavigateToProject, monitoringReportCardShouldNotExist } from "./steps";

const financeContactEmail = "contact77@test.co.uk";

describe("project dashboard as Finance Contact", () => {
  before(() => {
    visitApp();

    logInAsUserAndNavigateToProject(financeContactEmail);
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

  it("should not show the Monitoring Reports card to Finance Contacts", monitoringReportCardShouldNotExist);
});
