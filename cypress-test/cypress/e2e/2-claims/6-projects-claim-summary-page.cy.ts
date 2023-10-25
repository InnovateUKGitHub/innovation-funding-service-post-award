import { euiCostCleanUp } from "common/euiCostCleanUp";
import { visitApp } from "../../common/visit";
import {
  claimCommentBox,
  claimsDocUpload,
  forecastView,
  shouldShowProjectTitle,
  summaryAccessDocsDelete,
  summaryClearCommentsSave,
  summaryCommentsAdd,
  summaryCommentsDeleteOne,
  summaryCommentsTooMany,
  summaryReaccessClaim,
  summaryTotalCostsList,
} from "./steps";

const fc = "james.black@euimeabs.test";

describe("claims > Claim summary", () => {
  before(() => {
    visitApp({ asUser: fc, path: "projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1" });
  });

  before(() => {
    euiCostCleanUp;
  });

  it("Should navigate to the claims document page", () => {
    cy.button("Continue to claims documents").click();
  });

  it("Should upload a document", claimsDocUpload);

  it("Should display a document upload validation message", () => {
    cy.validationNotification("Your document has been uploaded.");
  });

  it("Should continue to forecast page", () => {
    cy.get("a").contains("Continue to update forecast").click();
    cy.heading("Update forecast");
  });

  it("Should navigate to summary page", () => {
    cy.button("Continue to summary").click();
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
    cy.get("a").contains("Edit costs to be claimed").click();
    cy.heading("Costs to be claimed");
  });

  it("Should go back to the summary page", () => {
    cy.go("back");
    cy.heading("Claim summary");
  });

  it("Should have a Claim documents subheading and guidance", () => {
    cy.get("h3").contains("Claim documents");
    cy.paragraph("All documents open in new window.");
  });

  it("Should display a link to the document that was uploaded", () => {
    cy.get("a").contains("testfile.doc");
  });

  it("Should correctly download the document", () => {
    cy.downloadFile(
      "https://www-acc-dev.apps.ocp4.innovateuk.ukri.org/api/documents/claims/a0E2600000kSotUEAS/a0D2600000z6KBxEAM/1/06826000002bXb5AAE/content",
    );
  });

  it("Should click the link to 'Edit claim documents'", () => {
    cy.get("a").contains("Edit claim documents").click();
    cy.heading("Claim documents");
  });

  it("Should go back to the summary page", () => {
    cy.go("back");
    cy.heading("Claim summary");
  });

  it("Should have forecast information", forecastView);

  it("Should click the link to 'Edit forecast'", () => {
    cy.get("a").contains("Edit forecast").click();
    cy.heading("Update forecast");
  });

  it("Should go back to the summary page", () => {
    cy.go("back");
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
    cy.button("Submit");
  });

  it("Should Save and return to claims", () => {
    cy.button("Save and return to claims").click();
    cy.heading("Claims");
  });

  it(
    "Should access the claim again and navigate to summary page to check comments saved correctly",
    summaryReaccessClaim,
  );

  it("Should access the document page and delete the uploaded document", summaryAccessDocsDelete);

  it("Should go back to the summary page", () => {
    cy.go("back");
    cy.heading("Claim summary");
  });

  it("Should clear the comments box and save and return to claims", summaryClearCommentsSave);
});
