import { visitApp } from "../../common/visit";
import { logInAsUserAndNavigateToProject, monitoringReportCardShouldNotExist } from "./steps";

const financeContactEmail = "contact77@test.co.uk";

describe("project dashboard as Finance Contact", () => {
  before(() => {
    visitApp();

    logInAsUserAndNavigateToProject(financeContactEmail);
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

  it("should not show the Monitoring Reports card to Finance Contacts", monitoringReportCardShouldNotExist);
});
