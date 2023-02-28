import { visitApp } from "../../common/visit";
import { testEach } from "../../support/methods";
import { navigateFilter, shouldFindMatchingProjectCard } from "./steps";

const monitoringOfficerEmail = "testman2@testing.com";

describe("projects dashboard > Monitoring Officer", () => {
  before(() => {
    visitApp({ asUser: monitoringOfficerEmail });
  });

  it("Should navigate to the project list and filter the correct project", navigateFilter);

  it("Should display the correct project card which displays 1 PCR to review", () => {
    ["Project change requests to review: 1", "EUI Small Ent Health"].forEach(cardItem => {
      cy.getByQA("project-328407").contains(cardItem);
    });
  });

  it("Should now navigate to the project", () => {
    cy.get("a").contains("328407").click();
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

  it("Should show a PCR to review", () => {
    cy.getByQA("message-pcrsToReview").contains("1");
  });
});
