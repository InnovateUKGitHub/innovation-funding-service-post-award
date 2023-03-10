import { visitApp } from "../../common/visit";
import { testEach } from "../../support/methods";
import { monitoringReportCardShouldNotExist, shouldFindMatchingProjectCard, navigateFilter } from "./steps";

const projectManagerFinanceContactEmail = "james.black@euimeabs.test";

describe("projects dashboard > Project Manager - Finance Contact", () => {
  before(() => {
    visitApp({ asUser: projectManagerFinanceContactEmail });
  });

  it("Should navigate to the project list and filter the correct project", navigateFilter);

  it("Should display the correct project card which shows a PCR has been queried", () => {
    ["Project change request queried", "EUI Small Ent Health"].forEach(cardItem => {
      cy.getByQA("project-328407").contains(cardItem);
    });
  });

  it("Should now navigate to the project", () => {
    cy.get("a").contains("328407").click();
  });

  it("Should display finance information at the top of the page", () => {
    ["Total eligible costs", "Eligible costs claimed to date", "Percentage of eligible costs claimed to date"].forEach(
      content => {
        cy.getByQA("section-content").contains(content);
      },
    );
    cy.get("h2").contains("Project costs to date");
  });

  testEach(["Claims", "Forecast", "Project change requests", "Documents", "Project details", "Finance summary"])(
    'should show the "$0" Link',
    shouldFindMatchingProjectCard,
  );

  it(
    "should not show the Monitoring Reports card to combined Project Manager/Finance Contact",
    monitoringReportCardShouldNotExist,
  );

  it("Should show a PCR is queried", () => {
    cy.getByQA("message-pcrQueried").contains("Project change request queried");
  });
});
