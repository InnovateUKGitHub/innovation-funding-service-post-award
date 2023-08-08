import { moClaimTidyUp } from "common/claimtidyup";
import { visitApp } from "../../common/visit";
import {
  goToQueriedClaim,
  navigateBackToDash,
  projectTitleAndSubheaders,
  queryTheClaim,
  submittedCostCats,
  openSectionClaimData,
  closedSectionAccordions,
  shouldShowProjectTitle,
  claimStatusTable,
  claimReviewTopThreeRows,
  claimReviewCostCat,
  topThreeRows,
  forecastCostCats,
} from "./steps";

describe("Claims > Review as MO", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/claims/dashboard" });
    moClaimTidyUp("Queried by Monitoring Officer");
  });

  it("Should ensure the Claims dashboard has loaded", () => {
    cy.heading("Claims");
  });

  it("Should have the project name displayed", shouldShowProjectTitle);

  it("Should have an Open section with a table of claims visible", openSectionClaimData);

  it("Should have a closed section with accordions", closedSectionAccordions);

  it("Should click into 'Review claim' as MO and ensure the page loads", () => {
    cy.get("tr").contains("ABS EUI Medium Enterprise").siblings().contains("a", "Review").click();
    cy.heading("Claim");
  });

  it("Should contain the project title and correct claim headings and information", projectTitleAndSubheaders);

  it("Should show the cost category table with submitted costs", submittedCostCats);

  it("Should have more than 10 status changes recorded", claimStatusTable);

  /**
   * This step needs updating once QA tags have been updated on the page.
   * Currently there are duplicates of 'accordion-toggle' on each accordion
   */
  it("Should click the 'Show all sections' and verify that the accordions are all open", () => {
    cy.button("Show all sections").click();
    cy.get(`[aria-expanded="true"]`);
  });

  it("Should check the top three rows including IAR status of forecast table is correct", claimReviewTopThreeRows);

  it("Should check the cost categories of the forecast table is correct", claimReviewCostCat);

  it("Should query the claim back to the partner", queryTheClaim);

  it("Should navigate back to the project dashboard and log in as the finance contact", navigateBackToDash);

  it("Should navigate to the queried claim and check for comments", goToQueriedClaim);

  it("Should check the forecast table is correct", () => {
    topThreeRows;
    forecastCostCats;
  });

  it("Should submit the claim", () => {
    cy.button("Continue to summary").click();
    cy.button("Submit claim").click();
  });
});
