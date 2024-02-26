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
  claimReviewDocArea,
  claimReviewExistingEvidence,
  claimReviewUploadDocument,
  claimReviewCheckForNewDoc,
  claimReviewResubmit,
  claimReviewDeleteDoc,
  claimQueriedCheckForDoc,
  claimReviewTopThreeRows,
  claimReviewCostCat,
  openAccordions,
  claimReviewForecastCostsClaiming,
  claimReviewForecastTotals,
  reviewLabourFCCopy,
  reviewLabourCostCat,
  reviewLabourDocUpload,
  reviewLabourRightLeft,
} from "./steps";
import {
  learnFiles,
  allowLargerBatchFileUpload,
  validateFileUpload,
  uploadFileTooLarge,
  validateExcessiveFileName,
  doNotUploadSpecialChar,
  uploadFileNameTooShort,
} from "common/fileComponentTests";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import { seconds } from "common/seconds";

describe("Claims > Review as MO", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/claims/dashboard" });
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
    moClaimTidyUp("ABS EUI Medium Enterprise", "Queried by Monitoring Officer");
  });

  after(() => {
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should ensure the Claims dashboard has loaded and return to Project overview", () => {
    cy.heading("Claims");
    cy.backLink("Back to project").click();
    cy.heading("Project overview");
  });

  it("Should switch user to the Monitoring Officer and then access the Claims tile", () => {
    cy.wait(2000);
    cy.switchUserTo("testman2@testing.com");
    cy.heading("Project overview");
    cy.selectTile("Claims");
    cy.heading("Claims");
  });

  it("Should have the project name displayed", shouldShowProjectTitle);

  it("Should have an Open section with a table of claims visible", openSectionClaimData);

  it("Should have a closed section with accordions", closedSectionAccordions);

  it("Should click into 'Review claim' as MO and ensure the page loads", () => {
    cy.get("tr").contains("ABS EUI Medium Enterprise").siblings().clickOn("a", "Review");
    cy.heading("Claim");
  });

  it("Should contain the project title and correct claim headings and information", projectTitleAndSubheaders);

  it("Should show the cost category table with submitted costs", submittedCostCats);

  it("Should access the Labour cost category and check the page doesn't have FC-specific copy", reviewLabourFCCopy);

  it("Should check the Labour cost category totals are correct", reviewLabourCostCat);

  it("Should check the Labour cost category document upload", reviewLabourDocUpload);

  it("Should have an additional information section", () => {
    cy.get("h2").contains("Additional information");
    cy.paragraph("Carpenters and electricians are doing stuff");
  });

  it("Should have right and left arrows for the next cost category options", reviewLabourRightLeft);

  it("Should have more than 10 status changes recorded", claimStatusTable);

  it("Should click the Show all sections", openAccordions);

  it("Should display the correct top three rows of forecast table", claimReviewTopThreeRows);

  it("Should display correct forecast cost categories", claimReviewCostCat);

  it("Should display correct 'Costs you are claiming' in the forecast table", claimReviewForecastCostsClaiming);

  it("Should display the correct forecast totals", claimReviewForecastTotals);

  it("Should have a documents area with correct copy", claimReviewDocArea);

  it("Should have a learn about files section", learnFiles);

  it("Should have a documents area with existing evidence", claimReviewExistingEvidence);

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a single file that is too large", uploadFileTooLarge);

  it(
    "Should attempt to upload three files totalling 33MB",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowLargerBatchFileUpload,
  );

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

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
    cy.clickOn("Back to project");
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
    cy.get("tr").contains("ABS EUI Medium Enterprise").siblings().clickOn("a", "Review");
    cy.heading("Claim");
  });

  it("Should expand the accordions", () => {
    cy.clickOn("Show all sections");
  });

  it("Should delete the file uploaded", claimReviewDeleteDoc);
});
