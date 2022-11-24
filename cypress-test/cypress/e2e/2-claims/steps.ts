export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click();
};

export const shouldShowCostCatTable = () => {
  cy.get("thead.govuk-table__head");
  cy.get("tr.govuk-table__row");
  cy.get("th.govuk-table__header").contains("Category");
  cy.get("th.govuk-table__header.govuk-table__header--numeric").contains("Total eligible costs");
  cy.get("th.govuk-table__header.govuk-table__header--numeric").contains("Eligible costs claimed to date");
  cy.get("th.govuk-table__header.govuk-table__header--numeric").contains("Costs claimed this period");
  cy.get("th.govuk-table__header.govuk-table__header--numeric").contains("Remaining eligible costs");
};

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

export const correctTableHeaders = () => {
  cy.get("thead.govuk-table__head").contains("Description");
  cy.get("thead.govuk-table__head").contains("Cost (£)");
  cy.get("thead.govuk-table__head").contains("Last updated");
};

export const newCostCatLineItem = () => {
  cy.get("a.govuk-link").contains("Add a cost").click();
  cy.get("input#description0.govuk-input").clear().type("Test line item");
  cy.get("input#value0.govuk-input.govuk-table__cell--numeric").clear().type("1000");
};

export const allowFileUpload = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  //cy.intercept("POST", "/api/documents/claim-details/*").as("uploadDocuments");
  cy.submitButton("Upload documents").click();
  cy.wait(7000);
  cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
};

export const reflectCostAdded = () => {
  cy.get("tr.govuk-table__row").contains("Labour");
  cy.get("span.currency").contains("£1,000.00");
};

export const clearUpCostCat = () => {
  cy.get("td.govuk-table__cell").contains("Labour").click();
  cy.getByQA("button_upload-qa").click();
  cy.wait(5000);
  cy.getByQA("button_delete-qa").contains("Remove").click();
  cy.wait(5000);
  cy.get("a.govuk-back-link").click();
  cy.wait(5000);
  cy.get("a.govuk-link").contains("Remove").click();
  cy.get("textarea#comments").clear();
};

export const evidenceRequiredMessage = () => {
  cy.get("h2").contains("Supporting documents");
  cy.get("div.govuk-grid-column-full").contains("evidence");
};

export const additionalInformationHeading = () => {
  cy.get("h2.govuk-fieldset__heading").contains("Additional information");
  cy.get("div.govuk-form-group").contains("Explain");
};

export const returnToCostCatPage = () => {
  //cy.intercept("POST", "api/claim-details/*/1/*").as("saveToCostCat");
  cy.getByQA("button_default-qa").click();
  cy.wait(10000);
};

export const selectFileDescription = () => {
  cy.get("select#description.govuk-select").select("10");
  cy.get("select#description.govuk-select").select("30");
  cy.get("select#description.govuk-select").select("60");
  cy.get("select#description.govuk-select").select("110");
  cy.get("select#description.govuk-select").select("120");
  cy.get("select#description.govuk-select").select("210");
  cy.get("select#description.govuk-select").select("220");
};

export const claimsDocUpload = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.wait(3000);
  cy.getByQA("button_upload-qa").click();
  cy.wait(3000);
};

export const claimsFileTable = () => {
  cy.get("th.govuk-table__header").contains("File name");
  cy.get("th.govuk-table__header").contains("Type");
  cy.get("th.govuk-table__header").contains("Date uploaded");
  cy.get("th.govuk-table__header").contains("Uploaded by");
};

export const forecastHeaders = () => {
  cy.get("th.govuk-table__header").contains("Period");
  cy.get("th.govuk-table__header").contains("1");
  cy.get("th.govuk-table__header").contains("2");
  cy.get("th.govuk-table__header").contains("3");
  cy.get("th.govuk-table__header").contains("4");
  cy.get("th.govuk-table__header").contains("IAR Due");
  cy.get("th.govuk-table__header").contains("No");
  cy.get("th.govuk-table__header").contains("Month");
  cy.get("th.govuk-table__header").contains("2022");
};

export const displayForecastTable = () => {
  cy.getByQA("field-claimForecastTable");
  cy.get("thead.govuk-table__head").get("tbody.govuk-table__body");
};

export const forecastCostCats = () => {
  const tableCell = cy.get("td.govuk-table__cell.sticky-col.sticky-col-left-1");
  tableCell.contains("Labour");
  tableCell.contains("Overheads");
  tableCell.contains("Materials");
  tableCell.contains("Capital usage");
  tableCell.contains("Subcontracting");
  tableCell.contains("Travel and subsistence");
  tableCell.contains("Other costs");
  tableCell.contains("Other Costs 2");
  tableCell.contains("Other Costs 3");
  tableCell.contains("Other Costs 4");
  tableCell.contains("Other Costs 5");
  tableCell.contains("Total");
};

export const accessOpenClaim = () => {
  cy.get("tbody").contains("Draft");
  cy.get("tbody").contains("Edit").click();
};

export const forecastView = () => {
  cy.get("h3").contains("Forecast");
  cy.get("dt.govuk-summary-list__key").contains("Total eligible costs");
  cy.get("dt.govuk-summary-list__key").contains("Total of forecasts and costs");
  cy.get("dt.govuk-summary-list__key").contains("Difference");
};

export const claimCommentBox = () => {
  cy.get("h2").contains("Add comments");
  cy.get("textarea#comments.govuk-textarea").clear().type(standardComments);
};

export const learnFiles = () => {
  cy.get("span.govuk-details__summary-text").contains("Learn more about files you can upload").click();
  cy.get("span.govuk-body.markdown").contains("You can upload");
};

export const savedFromPrev = () => {
  cy.getByAriaLabel("Labour Period 2").should("contain.value", "1000");
  cy.get("td.govuk-table__cell.sticky-col.sticky-col-right-3.govuk-table__cell--numeric").contains("£1,000.00");
  cy.getByAriaLabel("Overheads Period 2").should("contain.value", "1000");
};