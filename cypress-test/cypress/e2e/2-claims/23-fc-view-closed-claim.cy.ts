import { visitApp } from "common/visit";
import {
  closedDrgClaimDetails,
  correctABCadClosedCosts,
  costCategories,
  displayABCadClosedClaimSummary,
  expectedABCadClosedDetails,
  expectedABCadClosedStatuses,
  navigateAbCadClosedMaterials,
  navigateToABCadClosed,
  navigateToABCadSubtracting,
  navigateToProjectOverviewChangeToDRG,
  switchToSystemUserCheckDRGClosed,
} from "./steps";

describe("claims > FC view of closed claim", () => {
  before(() => {
    visitApp({ asUser: "contact77@test.co.uk" });
    cy.navigateToProject("879546");
    cy.selectTile("Claims");
  });

  it(
    'should navigate to the view claim page for the closed claim when the "view" link is clicked',
    navigateToABCadClosed,
  );

  it("Should display a claim summary at the top of the page", displayABCadClosedClaimSummary);

  it("should have a claim table with all the cost categories", () => {
    costCategories.forEach(cat => cy.getTableRow(cat));
  });

  it("should show the correct value for costs claimed this period for A B Cad.", correctABCadClosedCosts);

  it("should show the expected status and comments log", expectedABCadClosedStatuses);

  it("should navigate to the correct cost category details when the table element is clicked", () => {
    cy.clickOn("table tr td a", "Labour");
    cy.heading("Labour");
  });

  it("should show the expected details", expectedABCadClosedDetails);

  it("should show the expected uploaded supporting documents", () => {
    cy.contains("No documents uploaded");
  });

  it("should have navigation arrows indicating subcontracting and materials", () => {
    cy.contains("Previous").contains("Subcontracting");
    cy.contains("Next").contains("Materials");
  });

  it("should navigate to the materials page when Next > Materials is clicked", navigateAbCadClosedMaterials);

  it("should navigate back to the labour page when Previous > Labour is clicked", () => {
    cy.contains("Previous").contains("Labour").click();
    cy.heading("Labour");
  });

  it(
    "Should navigate back to the subcontracting page when Previous > Subcontracting is clicked",
    navigateToABCadSubtracting,
  );

  it(
    "Should navigate back to project dashboard and login as another FC to assert their closed claim is correct",
    navigateToProjectOverviewChangeToDRG,
  );

  it("should show the correct value for costs claimed this period for DRG.", closedDrgClaimDetails);

  it("Should log in as system user and check again.", switchToSystemUserCheckDRGClosed);
});
