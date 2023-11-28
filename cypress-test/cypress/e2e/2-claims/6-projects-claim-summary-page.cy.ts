import { fileTidyUp } from "common/filetidyup";
import { euiCostCleanUp, overheadsTidyUp } from "common/costCleanUp";
import { visitApp } from "../../common/visit";
import {
  allowBatchFileUpload,
  claimCommentBox,
  forecastView,
  shouldShowProjectTitle,
  summaryAccessDocsDelete,
  summaryCheckForCostRemoval,
  summaryClearCommentsSave,
  summaryClearCostCats,
  summaryCommentsAdd,
  summaryCommentsDeleteOne,
  summaryCommentsTooMany,
  summaryDocTable,
  summaryReaccessClaim,
  summaryTotalCostsList,
  summaryUpdateCostsClaimed,
} from "./steps";
import { testFileEUIFinance } from "common/testfileNames";

const fc = "james.black@euimeabs.test";

describe("claims > Claim summary", () => {
  before(() => {
    visitApp({ asUser: fc, path: "projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1" });
    euiCostCleanUp();
    overheadsTidyUp();
  });

  it("Should navigate to the claims document page", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should clear any documents that shouldn't be there", () => fileTidyUp("James Black"));

  it("Should upload a batch of 10 documents", allowBatchFileUpload("claimDocuments"));

  it("Should refresh the page and upload another document", () => {
    cy.reload();
    cy.fileInput(testFileEUIFinance);
    cy.getByLabel("Type").select("Schedule 3");
    cy.wait(500);
    cy.clickOn("Upload documents");
    cy.validationNotification("has been uploaded");
  });

  it("Should continue to forecast page", () => {
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
  });

  it("Should navigate to summary page", () => {
    cy.clickOn("Continue to summary");
  });

  it("Should have Claims summary header", () => {
    cy.heading("Claim summary");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to update forecast");
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should show the Period heading", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show Total costs to be claimed list", summaryTotalCostsList);

  it("Should click the link to edit claims costs", () => {
    cy.clickOn("Edit costs to be claimed");
    cy.heading("Costs to be claimed");
  });

  it("Should go back to the summary page", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });

  it("Should have a Claim documents subheading and guidance", () => {
    cy.get("h3").contains("Claim documents");
    cy.paragraph("All documents open in a new window.");
  });

  it("Should display a document table", summaryDocTable);

  it("Should display a link to the document that was uploaded", () => {
    cy.get("a").contains("testfile.doc");
  });

  it("Should correctly download the document", () => {
    cy.downloadFile(
      "https://www-acc-dev.apps.ocp4.innovateuk.ukri.org/api/documents/claims/a0E2600000kSotUEAS/a0D2600000z6KBxEAM/1/06826000002bXb5AAE/content",
    );
  });

  it("Should click the link to 'Edit claim documents'", () => {
    cy.clickOn("Edit claim documents");
    cy.heading("Claim documents");
  });

  it("Should go back to the summary page", () => {
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });

  it("Should have forecast information", forecastView);

  it("Should click the link to 'Edit forecast'", () => {
    cy.clickOn("Edit forecast");
    cy.heading("Update forecast");
  });

  it("Should go back to the summary page", () => {
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });

  it("Should have an 'Add comments' box with correct title character counter", claimCommentBox);

  it("Should populate the comments box with 1000 characters and count the characters entered", summaryCommentsAdd);

  it("Should attempt to add one too many characters and validate on save", summaryCommentsTooMany);

  it("Should delete the additional character", summaryCommentsDeleteOne);

  it("Should have pre-submission confirmation message", () => {
    cy.paragraph(
      "I confirm that the information I have provided in this claim is correct, complete and contains only eligible costs on an actual basis, which we confirm have been incurred and defrayed. I understand and accept that if I knowingly withhold information, or provide false or misleading information, this may result in my claim being rejected, termination of the contract, recovery of ineligible claims, civil action and where there is evidence of fraud, criminal prosecution.",
    );
  });

  it("Should have a Submit claim button", () => {
    cy.button("Submit claim");
  });

  it("Should Save and return to claims", () => {
    cy.clickOn("Save and return to claims");
    cy.heading("Claims");
  });

  it(
    "Should access the claim again and navigate to summary page to check comments saved correctly",
    summaryReaccessClaim,
  );

  it("Should access the document page and delete the uploaded document", summaryAccessDocsDelete);

  it("Should go back to the summary page", () => {
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });

  it("Should update costs claimed and ensure it updates correctly on Summary page.", summaryUpdateCostsClaimed);

  it("Should go back in and clear up the cost category", summaryClearCostCats);

  it("Should navigate to Summary page again and check for the removal of the costs", summaryCheckForCostRemoval);

  it("Should clear the comments box and save and return to claims", summaryClearCommentsSave);
});
