import { visitApp } from "common/visit";
import {
  access879546NavToClaims,
  accessClaimQuery,
  accessProjectCheckClaimsTile,
  accessProjectSubmitToMO,
  backOutToDashCheckStatus,
  backOutToDashCheckUpdatedCounter,
  checkClaimQueriedByMo,
  jamesBlackCounters,
  javierBaezCounters,
  navigateToDashCheckStatus,
  shouldNavigateToProjectDashboard,
  switchToJavierCheckStatus,
} from "./steps";
import { fileTidyUp } from "common/filetidyup";

const jamesBlack = "james.black@euimeabs.test";
const javierBaez = "testman2@testing.com";
const sarahShuang = "s.shuang@irc.trde.org.uk.test";

describe("projects dashboard > Project tile counters", () => {
  before(() => {
    visitApp({ asUser: jamesBlack });
  });

  it('should navigate to project dashboard when the "Projects" card is selected', shouldNavigateToProjectDashboard);

  it("Should view projects that James Black is associated with and display relevant counters", jamesBlackCounters);

  it("Should switch user to Javier Baez", () => {
    cy.switchUserTo(javierBaez);
  });

  it("should check the counters for Javier Baez", javierBaezCounters);

  it("Should switch user to Sarah Shuang", () => {
    cy.wait(1000);
    cy.switchUserTo(sarahShuang);
    cy.wait(500);
  });

  it("Should access project 879546 and navigate to the Claims tile", access879546NavToClaims);

  it(
    "Should check to make sure the claim is in a 'Queried by MO' status and if not, change it.",
    checkClaimQueriedByMo,
  );

  it("Should switch user to Sarah Shuang.", () => {
    cy.wait(500);
    cy.switchUserTo(sarahShuang);
    cy.wait(500);
  });

  it("Should now navigate back to the project dashboard and check the claim status.", navigateToDashCheckStatus);

  it(
    "Should switch user to Javier Baez and check that 879546 contains 'Claims to review: 1'",
    switchToJavierCheckStatus,
  );

  it("Should switch user back to Sarah Shuang", () => {
    cy.wait(500);
    cy.switchUserTo(sarahShuang);
    cy.wait(500);
  });

  it("Should now access the project again and submit the claim to the MO.", accessProjectSubmitToMO);

  it("Should back out to Project overview.", () => {
    cy.clickOn("Back to project");
    cy.heading("Project overview");
  });

  it("Should show claim submitted", () => {
    cy.getByQA("overview-link-claimsDashboard").contains("Claim submitted");
  });

  it("Should back out to project dashboard and check the counter no longer displays.", backOutToDashCheckStatus);

  it("Should switch user to Javier Baez", () => {
    cy.wait(500);
    cy.switchUserTo(javierBaez);
    cy.wait(500);
  });

  it("Should display the counter for project 879546 as being updated with Claims to review: 2", () => {
    cy.getByQA("project-879546").contains("Claims to review: 2");
  });

  it("Should access the project again and check the Claims tile for correct count.", accessProjectCheckClaimsTile);

  it("Should access the claim and query it to FC.", accessClaimQuery);

  it(
    "Should back out to Project overview and check the claims tile for updated counter.",
    backOutToDashCheckUpdatedCounter,
  );

  it("Should access the claim one last time and clear up any documents", () => {
    cy.switchUserTo(sarahShuang);
    cy.selectTile("Claims");
    cy.heading("Claims");
    cy.tableCell("Queried by Monitoring Officer").siblings().contains("Edit").click();
    cy.heading("Costs to be claimed");
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
    fileTidyUp("Sarah Shuang");
  });
});
