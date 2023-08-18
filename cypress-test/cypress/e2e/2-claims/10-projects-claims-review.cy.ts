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
  learnFiles,
  claimReviewDocArea,
  claimReviewExistingEvidence,
  claimReviewUploadDocument,
  claimReviewCheckForNewDoc,
  claimReviewResubmit,
  claimReviewDeleteDoc,
  claimQueriedCheckForDoc,
  claimReviewTopThreeRows,
  claimReviewCostCat,
  topThreeRows,
  forecastCostCats,
  openAccordions,
} from "./steps";

describe("Claims > Review as MO", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/claims/dashboard" });
    moClaimTidyUp("Queried by Monitoring Officer");
  });

  it("Should ensure the Claims dashboard has loaded", () => {
    cy.heading("Claims");
  });

  it("Should switch user to the Monitoring Officer", () => {
    cy.switchUserTo("testman2@testing.com");
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

  it("Should click the Show all sections", () => {
    cy.button("Show all sections").click();
  });

  it("Should have a documents area with correct copy", claimReviewDocArea);

  it("Should have a learn about files section", learnFiles);

  it("Should have a documents area with existing evidence", claimReviewExistingEvidence);

  it("Should allow a file to be uploaded", claimReviewUploadDocument);

  it("Should display the file just uploaded", claimReviewCheckForNewDoc);

  it("Should query the claim back to the partner", queryTheClaim);

  it("Should navigate back to the project dashboard", { retries: 3 }, navigateBackToDash);

  it("Should switch user to the FC", () => {
    cy.reload();
    cy.switchUserTo("s.shuang@irc.trde.org.uk.test");
  });

  it("Should navigate to the queried claim and go to the documents page", goToQueriedClaim);

  it("Should check for the document uploaded by the MO", claimQueriedCheckForDoc);

  it("Should continue to re-submit the claim", claimReviewResubmit);

  it("Should check for the correct title once resubmitted", { retries: 3 }, () => {
    cy.heading("Claims");
  });

  it("Should back out to project overview", () => {
    cy.backLink("Back to project").click();
    cy.heading("Project overview");
  });

  it("Should switch the user to the MO", () => {
    cy.switchUserTo("testman2@testing.com");
  });

  it("Should access the claims area again", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
  });

  it("Should click into 'Review claim' as MO and ensure the page loads", () => {
    cy.get("tr").contains("ABS EUI Medium Enterprise").siblings().contains("a", "Review").click();
    cy.heading("Claim");
  });

  it("Should expand the accordions", () => {
    cy.button("Show all sections").click();
  });

  it("Should delete the file uploaded", claimReviewDeleteDoc);
});
