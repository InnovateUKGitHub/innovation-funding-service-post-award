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
} from "./steps";

describe("Claims > Review as MO", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/claims/dashboard" });
    moClaimTidyUp("Queried by Monitoring Officer");
  });

  it("Should ensure the Claims dashboard has loaded", () => {
    cy.get("h1").contains("Claims");
  });

  it("Should have the project name displayed", shouldShowProjectTitle);

  it("Should have an Open section with a table of claims visible", openSectionClaimData);

  it("Should have a closed section with accordions", closedSectionAccordions);

  it("Should click into 'Review claim' as MO and ensure the page loads", () => {
    cy.get("tr").contains("ABS EUI Medium Enterprise").siblings().contains("a", "Review").click();
    cy.get("h1").contains("Claim");
  });

  it("Should contain the project title and correct claim headings and information", projectTitleAndSubheaders);

  it("Should show the cost category table with submitted costs", submittedCostCats);

  it("Should have more than 10 status changes recorded", claimStatusTable);

  it("Should query the claim back to the partner", queryTheClaim);

  it("Should navigate back to the project dashboard and log in as the finance contact", navigateBackToDash);

  it("Should navigate to the queried claim and check for comments before re-submitting", goToQueriedClaim);
});
