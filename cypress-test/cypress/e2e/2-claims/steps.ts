export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click();
};

export const shouldShowCostCatTable = () => {
  cy.get("thead.govuk-table__head");
  cy.get("tr.govuk-table__row");
  cy.tableHeader("Category");
  cy.tableHeader("Total eligible costs");
  cy.tableHeader("Eligible costs claimed to date");
  cy.tableHeader("Costs claimed this period");
  cy.tableHeader("Remaining eligible costs");
};

export const shouldShowAcademicCostCatTable = () => {
  [
    "Directly incurred - Staff",
    "Directly incurred - Travel and subsistence",
    "Directly incurred - Equipment",
    "Directly incurred - Other costs",
    "Directly allocated - Investigations",
    "Directly allocated - Estates costs",
    "Directly allocated - Other costs",
    "Indirect costs - Investigations",
    "Exceptions - Staff",
    "Exceptions - Travel and subsistence",
    "Exceptions - Equipment",
    "Exceptions - Other costs",
  ].forEach(academicCosts => {
    cy.tableCell(academicCosts);
  });
  [
    "Category",
    "Total eligible costs",
    "Eligible costs claimed to date",
    "Costs claimed this period",
    "Remaining eligible costs",
    "Total",
  ].forEach(header => {
    cy.tableHeader(header);
  });
};

export const shouldHaveCostCategoryTable = (category: string) => {
  cy.tableHeader(category);
};

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

export const correctTableHeaders = () => {
  cy.tableHeader("Description");
  cy.tableHeader("Cost (£)");
  cy.tableHeader("Last updated");
};

/**
 * Wait required in newCostCatLineItem below
 */
export const newCostCatLineItem = () => {
  /**
   * click remove first if there is already a line item
   */
  cy.getByQA("current-claim-summary-table")
    .find("tbody.govuk-table__body")
    .then($table => {
      if ($table.find("tr").length > 0) {
        cy.get("a").contains("Remove").click({ multiple: true });
      }
    });

  cy.get("a").contains("Add a cost").click();
  cy.getByAriaLabel("description of claim line item 1").clear().type("Test line item");
  cy.getByAriaLabel("value of claim line item 1").clear().type("1000").wait(800);
};

export const allowFileUpload = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.submitButton("Upload documents").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
};

export const reflectCostAdded = () => {
  cy.get("tr.govuk-table__row").contains("Labour");
  cy.get("span.currency").contains("£1,000.00");
};

export const clearUpCostCat = () => {
  cy.get("td.govuk-table__cell").contains("Labour").click();
  cy.getByQA("button_upload-qa").click();
  cy.getByQA("button_delete-qa").contains("Remove").click();
  cy.wait(2000);
  cy.get("a.govuk-back-link").click();
  cy.get("a.govuk-link").contains("Remove").first().click();
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
  cy.submitButton("Save and return to claims").click();
};

export const selectFileDescription = () => {
  cy.get("select#description").select("10");
  cy.get("select#description").select("30");
  cy.get("select#description").select("60");
  cy.get("select#description").select("110");
  cy.get("select#description").select("120");
  cy.get("select#description").select("210");
  cy.get("select#description").select("220");
};

export const claimsDocUpload = () => {
  cy.get("input#attachment").selectFile("cypress/common/testfile.doc");
  cy.uploadButton("Upload documents").click();
};

export const claimsFileTable = () => {
  ["File name", "Type", "Date uploaded", "Uploaded by"].forEach(fileTable => {
    cy.tableHeader(fileTable);
  });
};

export const forecastHeaders = () => {
  ["Period", "1", "2", "3", "4", "IAR Due", "No", "Month", "2023"].forEach(forecastHeads => {
    cy.tableHeader(forecastHeads);
  });
};

export const displayForecastTable = () => {
  cy.getByQA("field-claimForecastTable");
  cy.get("thead.govuk-table__head").get("tbody.govuk-table__body");
};

export const forecastCostCats = () => {
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
  ].forEach(forecastCostCat => {
    cy.tableCell(forecastCostCat);
  });
  cy.tableHeader("Total");
};

export const ktpCostCats = () => {
  [
    "Associate Employment",
    "Travel and subsistence",
    "Consumables",
    "Associate development",
    "Knowledge base supervisor",
    "Estate",
    "Indirect costs",
    "Other costs",
    "Additional associate support",
    "Subcontracting",
  ].forEach(ktpCostCat => {
    cy.tableCell(ktpCostCat);
  });
  cy.tableHeader("Total");
};

export const accessEUIOpenClaim = () => {
  cy.get("td").contains("EUI Small Ent Health (Lead)").siblings().contains("Edit").click();
};

export const accessOpenClaim = () => {
  cy.get("td").contains("Edit").click();
};

export const accessABSOpenClaim = () => {
  cy.get("td").contains("ABS EUI Medium Enterprise").siblings().contains("Edit").click();
};

export const forecastView = () => {
  cy.get("h3").contains("Forecast");
  cy.get("dt.govuk-summary-list__key").contains("Total eligible costs");
  cy.get("dt.govuk-summary-list__key").contains("Total of forecasts and costs");
  cy.get("dt.govuk-summary-list__key").contains("Difference");
};

export const claimCommentBox = () => {
  cy.get("h2").contains("Add comments");
  cy.getByQA("info-text-area").clear().type(standardComments);
};

export const learnFiles = () => {
  cy.get("span").contains("Learn more about files you can upload").click();
  cy.get("p").contains("You can upload");
  cy.get("p").contains("There is no limit");
};

export const savedFromPrev = () => {
  cy.getByAriaLabel("Labour Period 2").should("contain.value", "1000");
  cy.get("td.govuk-table__cell.sticky-col.sticky-col-right-3.govuk-table__cell--numeric").contains("£1,000.00");
  cy.getByAriaLabel("Overheads Period 2").should("contain.value", "1000");
};

export const openClosedSection = () => {
  cy.get("h2").contains("Open");
  cy.get("h2").contains("Closed");
  cy.get("p").contains("There are no open claims.");
  cy.get("p").contains("There are no closed claims for this partner.");
};

export const ktpGuidance = () => {
  [
    "For KTP claims, you must upload one of these claim approval documents",
    "LMC minutes",
    "LMC virtual approval",
  ].forEach(ktpDocGuidance => {
    cy.getByQA("iarText").contains(ktpDocGuidance);
  });
};

export const ktpForecastUpdate = () => {
  cy.get("a").contains("Continue to update forecast").click();
  [
    "Associate Employment",
    "Travel and subsistence",
    "Consumables",
    "Associate development",
    "Knowledge base supervisor",
    "Estate",
    "Indirect costs",
    "Other costs",
    "Additional associate support",
    "Subcontracting",
  ].forEach(ktpCostCat => {
    cy.getByQA("field-claimForecastTable").contains(ktpCostCat);
  });
};

export const ktpAssociateEmployment = () => {
  ["Associate Employment Period 2", "Associate Employment Period 3", "Associate Employment Period 4"].forEach(
    ktpInput => {
      cy.getByAriaLabel(ktpInput).clear().type("100");
    },
  );
  ["td:nth-child(3)", "td:nth-child(4)", "td:nth-child(5)"].forEach(column => {
    cy.get(column).contains("£100.00");
  });
  cy.get("td:nth-child(6)").contains("£300.00");
  ["Associate Employment Period 2", "Associate Employment Period 3", "Associate Employment Period 4"].forEach(
    ktpInput => {
      cy.getByAriaLabel(ktpInput).clear().type("0");
    },
  );
  cy.wait(500);
};

export const ktpHeadings = () => {
  cy.get("h1").contains("Associate Employment");
  cy.getByQA("validation-message-content").contains("This project does not follow the normal grant calculation rules");
  cy.getByQA("validation-message-content").contains(
    "The project and any partner may have one or more cost categories paid at a different funding award rate compared to your overall funding award rate.",
  );

  cy.getByQA("guidance-currency-message").contains("You can enter up to 120 separate lines of costs");
};

export const ktpCostsToClaim = () => {
  cy.get("h1").contains("Costs to be claimed");
  cy.getByQA("validation-message-content").contains("This project does not follow the normal grant calculation rules");
  cy.getByQA("validation-message-content").contains("The project and any partner may have one or more cost categories");
};

export const ktpCorrectCats = () => {
  [
    "Associate Employment",
    "Travel and subsistence",
    "Consumables",
    "Associate development",
    "Knowledge base supervisor",
    "Estate",
    "Indirect costs",
    "Other costs",
    "Additional associate support",
    "Subcontracting",
  ].forEach(ktpCostCat => {
    cy.getByQA("cost-cat").contains(ktpCostCat);
  });
  [
    "Category",
    "Total eligible costs",
    "Eligible costs claimed to date",
    "Costs claimed this period",
    "Remaining eligible costs",
    "Total",
  ].forEach(tableHeader => {
    cy.tableHeader(tableHeader);
  });
};

export const academicCosts = () => {
  [
    "Directly incurred - Staff",
    "Directly incurred - Travel and subsistence",
    "Directly incurred - Equipment",
    "Directly incurred - Other costs",
    "Directly allocated - Investigations",
    "Directly allocated - Estates costs",
    "Directly allocated - Other costs",
    "Indirect costs - Investigations",
    "Exceptions - Staff",
    "Exceptions - Travel and subsistence",
    "Exceptions - Equipment",
    "Exceptions - Other costs",
  ].forEach(academicCosts => {
    cy.tableCell(academicCosts);
  });
  cy.tableHeader("Total");
};

export const updateAcademicCosts = () => {
  [
    "Directly incurred - Staff Period 2",
    "Directly incurred - Staff Period 3",
    "Directly incurred - Staff Period 4",
    "Directly incurred - Travel and subsistence Period 2",
    "Directly incurred - Travel and subsistence Period 3",
    "Directly incurred - Travel and subsistence Period 4",
    "Directly incurred - Equipment Period 2",
    "Directly incurred - Equipment Period 3",
    "Directly incurred - Equipment Period 4",
    "Directly incurred - Other costs Period 2",
    "Directly incurred - Other costs Period 3",
    "Directly incurred - Other costs Period 4",
    "Directly allocated - Investigations Period 2",
    "Directly allocated - Investigations Period 3",
    "Directly allocated - Investigations Period 4",
    "Directly allocated - Estates costs Period 2",
    "Directly allocated - Estates costs Period 3",
    "Directly allocated - Estates costs Period 4",
    "Directly allocated - Other costs Period 2",
    "Directly allocated - Other costs Period 3",
    "Directly allocated - Other costs Period 4",
    "Indirect costs - Investigations Period 2",
    "Indirect costs - Investigations Period 3",
    "Indirect costs - Investigations Period 4",
    "Exceptions - Staff Period 2",
    "Exceptions - Staff Period 3",
    "Exceptions - Staff Period 4",
    "Exceptions - Travel and subsistence Period 2",
    "Exceptions - Travel and subsistence Period 3",
    "Exceptions - Travel and subsistence Period 4",
    "Exceptions - Equipment Period 2",
    "Exceptions - Equipment Period 3",
    "Exceptions - Equipment Period 4",
    "Exceptions - Other costs Period 2",
    "Exceptions - Other costs Period 3",
    "Exceptions - Other costs Period 4",
  ].forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("100");
  });
  cy.get("td:nth-child(14)").contains("£3,600.00");
  [
    "Directly incurred - Staff Period 2",
    "Directly incurred - Staff Period 3",
    "Directly incurred - Staff Period 4",
    "Directly incurred - Travel and subsistence Period 2",
    "Directly incurred - Travel and subsistence Period 3",
    "Directly incurred - Travel and subsistence Period 4",
    "Directly incurred - Equipment Period 2",
    "Directly incurred - Equipment Period 3",
    "Directly incurred - Equipment Period 4",
    "Directly incurred - Other costs Period 2",
    "Directly incurred - Other costs Period 3",
    "Directly incurred - Other costs Period 4",
    "Directly allocated - Investigations Period 2",
    "Directly allocated - Investigations Period 3",
    "Directly allocated - Investigations Period 4",
    "Directly allocated - Estates costs Period 2",
    "Directly allocated - Estates costs Period 3",
    "Directly allocated - Estates costs Period 4",
    "Directly allocated - Other costs Period 2",
    "Directly allocated - Other costs Period 3",
    "Directly allocated - Other costs Period 4",
    "Indirect costs - Investigations Period 2",
    "Indirect costs - Investigations Period 3",
    "Indirect costs - Investigations Period 4",
    "Exceptions - Staff Period 2",
    "Exceptions - Staff Period 3",
    "Exceptions - Staff Period 4",
    "Exceptions - Travel and subsistence Period 2",
    "Exceptions - Travel and subsistence Period 3",
    "Exceptions - Travel and subsistence Period 4",
    "Exceptions - Equipment Period 2",
    "Exceptions - Equipment Period 3",
    "Exceptions - Equipment Period 4",
    "Exceptions - Other costs Period 2",
    "Exceptions - Other costs Period 3",
    "Exceptions - Other costs Period 4",
  ].forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("0");
  });
};
