import { visitApp } from "../../common/visit";
import {
  additionalInfoSection,
  closedSectionAccordions,
  compNameAndHeadings,
  costCatWithClaimDetails,
  navigateToDashSwitchToFC,
  navigateToQueriedClaim,
  openSectionClaimData,
  queryClaimToFc,
  queryOrSubmitOptions,
  resubmitClaimAsFc,
  shouldShowProjectTitle,
} from "./steps";
import { claimTidyUp } from "common/claimtidyup";

describe("Claims > Review as MO and review as FC once queried", () => {
  before(() => {
    /**
     * cy.clearCookies is included because we utilise the user switcher a lot in this test.
     * I ran into issues where previous (or no) users persisted in user switcher.
     * Clearing cookies at the beginning of this test run ensures it begins correctly.
     */
    cy.clearCookies();
    visitApp({ path: "projects/a0E2600000kSvOGEA0/claims/dashboard" });
    claimTidyUp("Queried by Monitoring Officer");
  });

  it("Should make sure the MO is logged in", () => {
    cy.switchUserTo("testman2@testing.com");
  });

  it("Should have the project name displayed", shouldShowProjectTitle);

  it("Should show the Claim heading", () => {
    cy.get("h1").contains("Claims");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Should have an Open section with a table of claims visible", openSectionClaimData);

  it("Should have a closed section with accordions", closedSectionAccordions);

  it("Should allow the MO to access and review the submitted claim", () => {
    cy.get("a").contains("Review").click();
  });

  it("Should display competition name and type as well as page headings and project name", compNameAndHeadings);

  it("Should display cost category table with claim costs populated", costCatWithClaimDetails);

  /**
   * Note the current code in radiolist will not allow for getbylabel
   */
  it("Should allow MO to proceed by Querying or Submitting the claim", queryOrSubmitOptions);

  it("Should display an 'Additional information' section", additionalInfoSection);

  it("Should query the claim back to the finance contact", queryClaimToFc);

  it("Should navigate to project dashboard & switch user to Finance Contact", navigateToDashSwitchToFC);

  it("Should navigate to claims and see the queried claim", navigateToQueriedClaim);

  it("Should allow the FC to re-submit the claim", resubmitClaimAsFc);
});
