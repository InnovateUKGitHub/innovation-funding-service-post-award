import { fileTidyUp } from "common/filetidyup";

const euiFC = "this'is'a'test@innovateuk.gov.uk.bjssdev";
const drgFC = "contact77@test.co.uk";
const pcfNotReceivedMessage =
  "In order to submit your final claim you need to submit your Project Impact questions. An email has been sent to the Finance Contact on the Project with a link to review and update the Project Impact questions.";

("If you need more information or help to complete your Project Impact questions, see the Project Impact guidance in the Innovate UK Guidance for applicants. Alternatively, you can contact our customer support service by calling 0300 321 4357 or email support@iuk.ukri.org");

const finalClaimMessage = "This is the final claim.";

export const shouldShowCostCatTable = () => {
  [
    "Category",
    "Total eligible costs",
    "Eligible costs claimed to date",
    "Costs claimed this period",
    "Remaining eligible costs",
  ].forEach(header => {
    cy.tableHeader(header);
  });

  [
    "Labour",
    "Overheads",
    "Materials",
    "Capital usage",
    "Subcontracting",
    "Travel and subsistence",
    "Other costs",
    "Other costs 2",
    "Other costs 3",
    "Other costs 4",
    "Other costs 5",
    "Total",
  ].forEach(cat => {
    cy.tableCell(cat);
  });
};

export const selectFileDescription = () => {
  [
    "Independent accountant’s report",
    "Claim evidence",
    "Statement of expenditure",
    "LMC documents",
    "Schedule 3",
    "Invoice",
  ].forEach(fileDescription => {
    cy.get("select#description.govuk-select").select(fileDescription);
  });
  cy.getByQA("option-220-qa").should("not.exist");
};

export const navigateToEUIClaims = () => {
  cy.switchUserTo(euiFC);
  cy.selectTile("Claims");
  cy.get("h1").contains("Claims");
  cy.getByQA("current-claims-table").contains("Edit").click();
  cy.get("h1").contains("Costs to be claimed");
};

export const navigateToDRGClaims = () => {
  cy.switchUserTo(drgFC);
  cy.selectTile("Claims");
  cy.get("h1").contains("Claims");
  cy.getByQA("current-claims-table").contains("Edit").click();
  cy.get("h1").contains("Costs to be claimed");
};

export const validatePage = () => {
  cy.get("h2").contains("Period 1");
  shouldShowCostCatTable;
  cy.getByQA("validation-message-content").contains(finalClaimMessage);
};

export const proceedToDocuments = () => {
  cy.get("button").contains("Continue to claims documents").click();
  cy.get("h1").contains("Claim documents");
  cy.getByQA("validation-message-content").contains(pcfNotReceivedMessage);
  cy.getByQA("validation-message").contains(finalClaimMessage);
};

export const proceedToDRGDocuments = () => {
  cy.get("button").contains("Continue to claims documents").click();
  cy.get("h1").contains("Claim documents");
  cy.getByQA("validation-message").contains(finalClaimMessage);
};

export const summaryPageValidation = () => {
  cy.getByQA("validation-message-content").contains(finalClaimMessage);
  cy.getByQA("validation-message-content").contains(pcfNotReceivedMessage);
  cy.getByQA("validation-message-content").contains(
    "You must upload a supporting document before you can submit this claim.",
  );
};

export const drgSummaryPageValidation = () => {
  cy.getByQA("validation-message-content").contains(finalClaimMessage);
  cy.getByQA("validation-message-content").should("not.have.text", pcfNotReceivedMessage);
};

export const pcfClaimsDocUpload = () => {
  fileTidyUp("Neil O'Reilly");
  cy.get("input#attachment").selectFile("cypress/common/testfile.doc");
  cy.uploadButton("Upload documents").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
  cy.reload();
  cy.getByQA("validation-message-content").contains(pcfNotReceivedMessage);
  cy.getByQA("button_delete-qa").contains("Remove").click();
  cy.getByQA("validation-message-content").contains("has been deleted.");
};
