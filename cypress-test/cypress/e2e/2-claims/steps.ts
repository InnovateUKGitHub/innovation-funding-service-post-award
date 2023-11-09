import { claimReviewFileTidyUp, fileTidyUp } from "common/filetidyup";
import { loremIpsum1k } from "common/lorem";
import { testFile } from "common/testfileNames";
let date = new Date();
let comments = JSON.stringify(date);

export const costCategories = [
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
] as const;

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click();
  cy.getByQA("noClosedClaims-0012600001amaskAAA").contains("There are no closed claims for this partner.");
  cy.getByQA("noClosedClaims-0012600001amb0ZAAQ").contains("There are no closed claims for this partner.");
  cy.get("td").contains("Period 1");
};

export const shouldShowCostCatTable = () => {
  [
    "Category",
    "Total eligible costs",
    "Eligible costs claimed to date",
    "Costs claimed this period",
    "Remaining eligible costs",
  ].forEach(header => {
    cy.tableHeader(header);
  }),
    [
      ["Labour", "£35,000.00", "£0.00", "£35,000.00"],
      ["Overheads", "£35,000.00", "£0.00", "£35,000.00"],
      ["Materials", "£35,000.00", "£35,000.00", "£0.00"],
      ["Capital usage", "£35,000.00", "£35,000.00", "£0.00"],
      ["Subcontracting", "£0.00", "£0.00", "£0.00"],
      ["Travel and subsistence", "£35,000.00", "£35,000.00", "£0.00"],
      ["Other costs", "£35,000.00", "£35,000.00", "£0.00"],
      ["Other costs 2", "£35,000.00", "£35,000.00", "£0.00"],
      ["Other costs 3", "£35,000.00", "£35,000.00", "£0.00"],
      ["Other costs 4", "£35,000.00", "£35,000.00", "£0.00"],
      ["Other costs 5", "£35,000.00", "£35,000.00", "£0.00"],
      ["Total", "£350,000.00", "£280,000.00", "£70,000.00"],
    ].forEach(([costCat, eligibleCosts, claimedToDate, remainingEligibleCosts], rowNumber = 0) => {
      cy.get("tr")
        .eq(rowNumber + 1)
        .within(() => {
          cy.get("td:nth-child(1)").contains(costCat);
          cy.get("td:nth-child(2)").contains(eligibleCosts);
          cy.get("td:nth-child(4)").contains(claimedToDate);
          cy.get("td:nth-child(5)").contains(remainingEligibleCosts);
        });
    });
};

export const shouldShowCostsClaimedtoDateTable = () => {
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
    ["Labour", "£35,000.00", "£10,000.00", "£25,000.00"],
    ["Overheads", "£35,000.00", "£9,000.00", "£26,000.00"],
    ["Materials", "£35,000.00", "£8,000.00", "£27,000.00"],
    ["Capital usage", "£35,000.00", "£7,000.00", "£28,000.00"],
    ["Subcontracting", "£0.00", "£0.00", "£0.00"],
    ["Travel and subsistence", "£35,000.00", "£6,000.00", "£29,000.00"],
    ["Other costs", "£35,000.00", "£5,000.00", "£30,000.00"],
    ["Other costs 2", "£35,000.00", "£4,000.00", "£31,000.00"],
    ["Other costs 3", "£35,000.00", "£3,000.50", "£31,999.50"],
    ["Other costs 4", "£35,000.00", "£2,000.30", "£32,999.70"],
    ["Other costs 5", "£35,000.00", "£666.66", "£34,333.34"],
    ["Total", "£350,000.00", "£54,667.46", "£295,332.54"],
  ].forEach(([costCat, eligibleCosts, claimedToDate, remainingEligibleCosts], rowNumber = 0) => {
    cy.get("tr")
      .eq(rowNumber + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(costCat);
        cy.get("td:nth-child(2)").contains(eligibleCosts);
        cy.get("td:nth-child(3)").contains(claimedToDate);
        cy.get("td:nth-child(5)").contains(remainingEligibleCosts);
      });
  });
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

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

export const correctTableHeaders = () => {
  ["Description", "Cost (£)", "Last updated"].forEach(header => {
    cy.tableHeader(header);
  });
  ["Total costs", "Forecast costs"].forEach(cell => {
    cy.tableCell(cell);
  });
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
  cy.fileInput("testfile.doc");
  cy.submitButton("Upload documents").click();
  cy.validationNotification("Your document has been uploaded.");
};

export const documents = [
  "testfile.doc",
  "testfile2.doc",
  "testfile3.doc",
  "testfile4.doc",
  "testfile5.doc",
  "testfile6.doc",
  "testfile7.doc",
  "testfile8.doc",
  "testfile9.doc",
  "testfile10.doc",
];

const documentPaths = documents.map(doc => `cypress/documents/${doc}`);

export const rejectElevenDocsAndShowError = () => {
  const tooManyDocuments = [...documentPaths, "cypress/documents/testfile.doc"];
  cy.get(`input[type="file"]`).selectFile(tooManyDocuments);
  cy.submitButton("Upload documents").click();
  cy.getByRole("alert").contains("You can only select up to 10 files at the same time.");
  cy.reload();
};

export const allowBatchFileUpload = () => {
  const tenFiles = [...documentPaths];
  cy.get(`input[type="file"]`).selectFile(tenFiles);
  cy.submitButton("Upload documents").click();
};

export const deleteClaimDocument = (document: string) => {
  cy.get("tr").then($tr => {
    if ($tr.text().includes(document)) {
      cy.log(`Deleting existing ${document} document`);
      cy.tableCell(document).parent().siblings().contains("button", "Remove").click({ force: true });
      cy.getByAriaLabel("success message").contains(`'${document}' has been removed.`);
    }
  });
};

export const reflectCostAdded = () => {
  cy.get("tr.govuk-table__row").contains("Labour");
  cy.get("span.currency").contains("£1,000.00");
};

export const clearUpLabourCostCat = () => {
  cy.get("td.govuk-table__cell").contains("Labour").click();
  cy.getByQA("button_upload-qa").click();
  cy.heading("Labour documents");
  cy.getByQA("button_delete-qa").contains("Remove").click();
  cy.wait(1000);
  cy.get("a.govuk-back-link").click();
  cy.heading("Labour");
  cy.get("a.govuk-link").contains("Remove").first().click();
  cy.get("textarea#comments").clear();
};

export const clearUpOverheadsCostCat = () => {
  cy.get("td.govuk-table__cell").contains("Overheads").click();
  cy.heading("Overheads");
  cy.get("a.govuk-link").contains("Remove").first().click();
};

export const evidenceRequiredMessage = () => {
  cy.get("h2").contains("Supporting documents");
  cy.getByQA("section-content").contains("Upload evidence of the costs");
  cy.get("h2").contains("Files uploaded");
  cy.paragraph("No documents uploaded");
};

export const additionalInformationHeading = () => {
  cy.get("h2").contains("Additional information");
  cy.get("#comments-hint").contains("Explain any difference");
};

export const returnToCostCatPage = () => {
  cy.submitButton("Save and return to claims").click();
};

export const selectFileDescription = () => {
  ["10", "30", "60", "110", "120", "210", "220"].forEach(selection => {
    cy.get("select#description").select(selection);
  });
};

export const claimsDocUpload = () => {
  cy.button("Upload documents").click();
  cy.validationLink("Choose a file to upload");
  cy.fileInput("testfile.doc");
  cy.button("Upload documents").click();
  cy.validationNotification("has been uploaded.");
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
  [
    ["Total eligible costs", "£350,000.00"],
    ["Total of forecasts and costs", "£280,040.00"],
    ["Difference", "£69,960.00 (19.99%)"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key).contains(item);
  });
};

export const claimCommentBox = () => {
  cy.get("legend").contains("Add comments");
  cy.get("textarea").clear();
  cy.paragraph("You have 1000 characters remaining");
};

export const learnFiles = () => {
  cy.get("span").contains("Learn more about files you can upload").click();
  ["PDF", "test", "presentation", "spreadsheet", "images", "be less than 32MB", "have a unique file"].forEach(list => {
    cy.list(list);
  });
  ["You can upload", "There is no limit", "Each document must"].forEach(description => {
    cy.paragraph(description);
  });
};

export const savedFromPrev = () => {
  cy.getByAriaLabel("Labour Period 2").should("have.value", "33.33");
  cy.get("td.govuk-table__cell.sticky-col.sticky-col-right-3.govuk-table__cell--numeric").contains("£33.33");
  cy.getByAriaLabel("Overheads Period 2").should("have.value", "6.666");
};

export const openClosedSection = () => {
  cy.get("h2").contains("Open");
  cy.get("h2").contains("Closed");
  cy.paragraph("There are no open claims.");
  cy.paragraph("There are no closed claims for this partner.");
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
  cy.heading("Associate Employment");
  cy.validationNotification("This project does not follow the normal grant calculation rules");
  cy.validationNotification(
    "The project and any partner may have one or more cost categories paid at a different funding award rate compared to your overall funding award rate.",
  );

  cy.getByQA("guidance-currency-message").contains("You can enter up to 120 separate lines of costs");
};

export const ktpCostsToClaim = () => {
  cy.heading("Costs to be claimed");
  cy.validationNotification("This project does not follow the normal grant calculation rules");
  cy.validationNotification("The project and any partner may have one or more cost categories");
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
  const costs = [
    "Directly incurred - Staff Period 3",
    "Directly incurred - Staff Period 4",
    "Directly incurred - Staff Period 5",
    "Directly incurred - Travel and subsistence Period 3",
    "Directly incurred - Travel and subsistence Period 4",
    "Directly incurred - Travel and subsistence Period 5",
    "Directly incurred - Equipment Period 3",
    "Directly incurred - Equipment Period 4",
    "Directly incurred - Equipment Period 5",
    "Directly incurred - Other costs Period 3",
    "Directly incurred - Other costs Period 4",
    "Directly incurred - Other costs Period 5",
    "Directly allocated - Investigations Period 3",
    "Directly allocated - Investigations Period 4",
    "Directly allocated - Investigations Period 5",
    "Directly allocated - Estates costs Period 4",
    "Directly allocated - Estates costs Period 4",
    "Directly allocated - Estates costs Period 5",
    "Directly allocated - Other costs Period 3",
    "Directly allocated - Other costs Period 4",
    "Directly allocated - Other costs Period 5",
    "Indirect costs - Investigations Period 3",
    "Indirect costs - Investigations Period 4",
    "Indirect costs - Investigations Period 5",
    "Exceptions - Staff Period 3",
    "Exceptions - Staff Period 4",
    "Exceptions - Staff Period 5",
    "Exceptions - Travel and subsistence Period 3",
    "Exceptions - Travel and subsistence Period 4",
    "Exceptions - Travel and subsistence Period 5",
    "Exceptions - Equipment Period 3",
    "Exceptions - Equipment Period 4",
    "Exceptions - Equipment Period 5",
    "Exceptions - Other costs Period 3",
    "Exceptions - Other costs Period 4",
    "Exceptions - Other costs Period 5",
  ];

  costs.forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("100");
  });
  cy.get("td:nth-child(14)").contains("£52,500.00");
  costs.forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("0");
  });
};

export const showAClaim = () => {
  cy.get("h3").should("contain.text", "Period");
  cy.get("a").contains("Edit");
  [
    "Partner",
    "Forecast costs for period",
    "Actual costs for period",
    "Difference",
    "Status",
    "Date of last update",
  ].forEach(header => {
    cy.tableHeader(header);
  });
};

export const openSectionClaimData = () => {
  cy.get("h2").contains("Open");
  [
    "Partner",
    "Forecast costs for period",
    "Actual costs for period",
    "Difference",
    "Status",
    "Date of last update",
  ].forEach(header => {
    cy.tableHeader(header);
  });
  [
    "EUI Small Ent Health (Lead)",
    "£350,000.00",
    "£0.00",
    "Draft",
    "View",
    "ABS EUI Medium Enterprise",
    "£17,900.00",
    "-£17,900.00",
    "Submitted to Monitoring Officer",
  ].forEach(cell => {
    cy.tableCell(cell);
  });
};

export const closedSectionAccordions = () => {
  cy.get("h2").contains("Closed");
  cy.get("span").contains("Show all sections").click();
  ["EUI Small Ent Health (Lead)", "A B Cad Services", "ABS EUI Medium Enterprise"].forEach(project => {
    cy.get("span").contains(project);
  });
  cy.paragraph("There are no closed claims for this partner");
};

export const projectTitleAndSubheaders = () => {
  ["Competition name:", "Competition type:", "a002600000CEUmL", "CR&D"].forEach(subHeading => {
    cy.paragraph(subHeading);
  });
  shouldShowProjectTitle;
  cy.get("h2").contains("ABS EUI Medium Enterprise claim for period 1:");
};

export const submittedCostCats = () => {
  ["Category", "Forecast for period", "Costs claimed this period", "Difference (£)", "Difference (%)"].forEach(
    tableHead => {
      cy.tableHeader(tableHead);
    },
  );

  [
    { category: "Labour", data: ["£0.00", "£2,000.00", "-£2,000.00", "0.00%"] },
    { category: "Overheads", data: ["£0.00", "£100", "-£100", "0.00%"] },
    { category: "Materials", data: ["£0.00", "£200", "-£200.00", "0.00%"] },
    { category: "Capital usage", data: ["£0.00", "£3,000.00", "-£3,000.00", "0.00%"] },
    { category: "Subcontracting", data: ["£0.00", "£1,500.00", "-£1,500.00", "0.00%"] },
    { category: "Travel and subsistence", data: ["£0.00", "£1,600.00", "-£1,600.00", "0.00%"] },
    { category: "Other costs", data: ["£0.00", "£1,700.00", "-£1,700.00", "0.00%"] },
    { category: "Other costs 2", data: ["£0.00", "£1,800.00", "-£1,800.00", "0.00%"] },
    { category: "Other costs 3", data: ["£0.00", "£1,900.00", "-£1,900.00", "0.00%"] },
    { category: "Other costs 4", data: ["£0.00", "£2,000.00", "-£2,000.00", "0.00%"] },
    { category: "Other costs 5", data: ["£0.00", "£2,100.00", "-£2,100.00", "0.00%"] },
  ].forEach(row => {
    row.data.forEach(cost => {
      cy.contains("td", row.category).siblings().contains(cost);
    });
  });
};

export const queryTheClaim = () => {
  cy.getByQA("status_MO Queried").click({ force: true });
  cy.getByQA("additional-information-title").contains("Additional information");
  cy.getByQA("field-comments").contains(
    "If you query the claim, you must explain what the partner needs to amend. If you approve the claim, you may add a comment to Innovate UK in support of the claim.",
  );
  cy.get("textarea").clear().type(comments);
  cy.paragraph("You have");
  cy.paragraph("I am satisfied that the costs claimed appear to comply");
  cy.getByQA("cr&d-reminder").contains("You must submit a monitoring report");
  cy.submitButton("Send query").click();
  cy.heading("Claims");
};

export const navigateBackToDash = () => {
  cy.backLink("Back to project").click();
  cy.heading("Project overview");
};

export const goToQueriedClaim = () => {
  cy.selectTile("Claims");
  cy.contains("td", "Queried by Monitoring Officer").siblings().contains("a", "Edit").click();
  cy.heading("Costs to be claimed");
  cy.get("td").contains(comments);
  cy.button("Continue to claims documents").click();
};

export const beginEditing = () => {
  cy.get("a").contains("Edit").click();
  cy.heading("Costs to be claimed");
  cy.get("a").contains("Labour").click();
};

export const add120Lines = () => {
  cy.get('input[name="itemCount"]').then($input => {
    const count = Number($input.val() || 0);

    for (let i = count; i < 120; i++) {
      cy.get("a").contains("Add a cost").click();
      cy.get("#description" + i).type("Labour" + i);
      cy.get("#value" + i).type("100");
    }
  });
  cy.wait(500);
  cy.get("a").contains("Add a cost").should("not.exist");
};

export const saveLineItems = () => {
  cy.button("Save and return to claims").click();
  cy.wait(5000);
  cy.get("h1").contains("Costs to be claimed", { timeout: 60000 });
};

export const removeLineItems = () => {
  cy.get("a").contains("Labour").click();
  cy.heading("Labour");
  cy.get('input[name="itemCount"]').then($input => {
    const count = Number($input.val() || 0);
    for (let i = count; i > 0; i--) {
      cy.get("a").contains("Remove").click();
    }
  });
};

export const validateLineItem = () => {
  cy.getByAriaLabel("value of claim line item 1").clear().type("gsdfadsf").wait(500);
  cy.submitButton("Save and return to claims").click();
  cy.validationLink("Costs must be a number");
  cy.getByAriaLabel("value of claim line item 1").clear().type("1000").wait(500);
};

export const validateForecast = () => {
  cy.getByAriaLabel("Labour Period 2").clear().wait(500);
  cy.button("Save and return to claims").click();
  cy.validationLink("Forecast is required");
};

export const academicForecastNavigate = () => {
  cy.backLink("Back to claims").click();
  cy.heading("Costs to be claimed");
  cy.button("Continue to claims documents").click();
  cy.heading("Claim documents");
  cy.get("a").contains("Continue to update forecast").click();
};

export const drgClaimTwo = () => {
  cy.selectTile("Claims");
  cy.heading("Claims");
  cy.tableCell("Draft").siblings().contains("Edit").click();
  cy.heading("Costs to be claimed");
  cy.get("h2").contains("Period 2");
};

export const claimStatusTable = () => {
  cy.getByQA("claim-status-change-table")
    .find("tr")
    .then(row => {
      let rowNumber = row.length;
      if (rowNumber < 11) {
        throw new Error("Test failed");
      }
    });
};

export const period2AbCad = () => {
  cy.selectTile("Claims");
  cy.get("td").contains("Period 2").siblings().contains("a", "Edit").click();
  cy.heading("Costs to be claimed");
};

export const capPotMessageNotExist = () => {
  cy.getByQA("validation-message-content").should("not.exist");
};

export const triggerCapPot = () => {
  ["Labour", "Materials", "Subcontracting"].forEach(costCat => {
    cy.get("a").contains(costCat).click();
    cy.heading(costCat);
    cy.get("a").contains("Add a cost").click();
    cy.getByAriaLabel("description of claim line item 1").clear().type("Test line item");
    cy.getByAriaLabel("value of claim line item 1").clear().type("5001").wait(800);
    cy.submitButton("Save and return to claims").click();
    cy.heading("Costs to be claimed");
  });
};

export const saveAndReturnToPrepare = () => {};

export const capPotMessageDoesExist = () => {
  cy.validationNotification(
    "Please be aware, approval of this claim will cause a percentage of your grant to be retained.",
  );
};

export const clearCostCatReturn = () => {
  ["Labour", "Materials", "Subcontracting"].forEach(costCat => {
    cy.get("a").contains(costCat).click();
    cy.heading(costCat);
    cy.get("a").contains("Remove").click();
    cy.get("button").contains("Save and return to claims").click();
    cy.get("h1").contains("Costs to be claimed");
  });
};

export const acceptInputAndUpdate = () => {
  [
    [22728.44, 4545.688],
    [50.24, 10.048],
    [6530.64, 1306.128],
    [50.64, 10.128],
    [100, 20],
    [1000000, 200000],
    [10000.33, 2000.066],
    [5.11, 1.022],
    [33.33, 6.666],
  ].forEach(([labourCost, overhead]) => {
    cy.getByAriaLabel("Labour Period 2").clear().type(String(labourCost));
    let newCurrency = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    });
    cy.get("tr")
      .eq(4)
      .within(() => {
        cy.get("td:nth-child(14)").contains(newCurrency.format(labourCost));
      });
    cy.getByAriaLabel("Overheads Period 2").should("have.value", overhead);
    cy.get("tr")
      .eq(5)
      .within(() => {
        cy.get("td:nth-child(14)").contains(newCurrency.format(overhead));
      });
  });
};

export const topThreeRows = () => {
  [
    ["Period", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    ["IAR Due", "No", "No", "Yes", "No", "No", "Yes", "No", "No", "Yes", "No", "No", "Yes"],
    [
      "Month",
      "Mar 2023",
      "Apr 2023",
      "May 2023",
      "Jun 2023",
      "Jul 2023",
      "Aug 2023",
      "Sep 2023",
      "Oct 2023",
      "Nov 2023",
      "Dec 2023",
      "Jan 2024",
      "Feb 2024",
    ],
  ].forEach((cols, rowNumber = 0) => {
    cy.get("tr")
      .eq(rowNumber + 1)
      .within(() => {
        for (let i = 0; i < cols.length; i++) {
          cy.get(`th:nth-child(${i + 1})`).contains(cols[i]);
        }
      });
  });
};

export const claimReviewTopThreeRows = () => {
  cy.getByQA("forecast-table").within(() => {
    [
      ["Period", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      ["IAR Due", "No", "No", "Yes", "No", "No", "Yes", "No", "No", "Yes", "No", "No", "Yes"],
      [
        "Month",
        "Feb 2023",
        "Mar 2023",
        "Apr 2023",
        "May 2023",
        "Jun 2023",
        "Jul 2023",
        "Aug 2023",
        "Sep 2023",
        "Oct 2023",
        "Nov 2023",
        "Dec 2023",
        "Jan 2024",
      ],
    ].forEach((cols, rowNumber = 0) => {
      cy.get("tr")
        .eq(rowNumber + 1)
        .within(() => {
          for (let i = 0; i < cols.length; i++) {
            cy.get(`th:nth-child(${i + 1})`).contains(cols[i]);
          }
        });
    });
  });
};

export const claimReviewDocArea = () => {
  cy.getByQA("projectDocumentUpload").within(() => {
    cy.paragraph("You can upload and store any documents for this claim on this page.");
    cy.paragraph(
      "You will also be able to see any documents added to the claim by the finance contact and Innovate UK.",
    );
  });
};

export const claimReviewExistingEvidence = () => {
  claimReviewFileTidyUp("Javier Baez");
  [
    ["Sheet1.xlsx", "Claim evidence", "4 Sep 2023", "6KB", "Innovate UK"],
    ["Sheet2.xlsx", "Claim evidence", "20 Mar 2023", "6KB", "Innovate UK"],
    ["Sheet3.xlsx", "Claim evidence", "20 Mar 2023", "6KB", "Innovate UK"],
    ["t10.pdf", "Claim evidence", "20 Mar 2023", "6KB", "Innovate UK"],
  ].forEach(([claimDoc, type, date, size, uploadBy], rowNumber = 1) => {
    cy.getByQA("claim-supporting-documents-container").within(() => {
      cy.get("tr")
        .eq(rowNumber + 2)
        .within(() => {
          cy.get("td:nth-child(1)").contains(claimDoc);
          cy.get("td:nth-child(2)").contains(type);
          cy.get("td:nth-child(3)").contains(date);
          cy.get("td:nth-child(4)").contains(size);
          cy.get("td:nth-child(5)").contains(uploadBy);
        });
    });
  });
};

export const claimReviewCostCat = () => {
  cy.getByQA("forecast-table").within(() => {
    costCategories.forEach(forecastCostCat => {
      cy.tableCell(forecastCostCat);
    });
    cy.tableHeader("Total");
  });
};

export const claimReviewForecastCostsClaiming = () => {
  cy.getByQA("forecast-table").within(() => {
    [
      "£2,000.00",
      "£100.00",
      "£200.00",
      "£3,000.00",
      "£1,500.00",
      "£1,600.00",
      "£1,700.00",
      "£1,800.00",
      "£1,900.00",
      "£2,000.00",
      "£2,100.00",
      "£17,900.00",
    ].forEach((cost, index) => {
      cy.get("tr")
        .eq(index + 4)
        .within(() => {
          cy.get("td:nth-child(2)").contains(cost);
        });
    });
  });
};

export const claimReviewForecastTotals = () => {
  [
    ["£2,000.00", "£10,000.00", "-80.00%"],
    ["£100.00", "£1,000.00", "-90.00%"],
    ["£200.00", "£10,000.00", "-98.00%"],
    ["£3,000.00", "£10,000.00", "-70.00%"],
    ["£3,500.00", "£10,000.00", "-65.00%"],
    ["£5,600.00", "£10,000.00", "-44.00%"],
    ["£1,700.00", "£10,000.00", "-83.00%"],
    ["£1,800.00", "£10,000.00", "-82.00%"],
    ["£1,900.00", "£10,000.00", "-81.00%"],
    ["£2,000.00", "£10,000.00", "-80.00%"],
    ["£2,100.00", "£10,000.00", "-79.00%"],
  ].forEach((cols, index) => {
    cy.getByQA("forecast-table").within(() => {
      cy.get("tr")
        .eq(index + 4)
        .within(() => {
          for (let i = 0; i < cols.length; i++) {
            cy.get(`td:nth-child(${i + 14})`).contains(cols[i]);
          }
        });
    });
  });
};

export const openAccordions = () => {
  cy.button("Show all sections").click();
  ["forecast-accordion", "log-accordion", "upload-supporting-documents-form-accordion"].forEach(accordion => {
    cy.getByQA(accordion).within(() => {
      cy.get(`[aria-expanded="true"]`);
    });
  });
};

export const claimReviewUploadDocument = () => {
  cy.fileInput("testfile.doc");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Invoice");
  cy.submitButton("Upload documents").click();
  cy.validationNotification("Your document has been uploaded");
};

export const claimReviewCheckForNewDoc = () => {
  cy.getByQA("claim-supporting-documents-container").within(() => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("td:nth-child(1)").contains("testfile.doc");
        cy.get("td:nth-child(2)").contains("Invoice");
        cy.get("td:nth-child(3)").contains("2023");
        cy.get("td:nth-child(4)").contains("0KB");
        cy.get("td:nth-child(5)").contains("Javier Baez");
      });
  });
};

export const claimQueriedCheckForDoc = () => {
  ["testfile.doc", "Invoice", "2023", "0KB", "Javier Baez"].forEach(fileDetails => {
    cy.get("tr").contains(fileDetails);
  });
};

export const claimReviewResubmit = () => {
  cy.get("a").contains("Continue to update forecast").click();
  cy.button("Continue to summary").click();
  cy.button("Submit claim").click();
};

export const claimReviewDeleteDoc = () => {
  cy.getByQA("claim-supporting-documents-container").within(() => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.getByQA("button_delete-qa").contains("Remove").click();
      });
  });
  cy.validationNotification("has been removed.");
};

export const summaryTotalCostsList = () => {
  [
    ["Total costs to be claimed", "£280,000.00"],
    ["Funding level", "65.00%"],
    ["Total costs to be paid", "£182,000.00"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key).contains(item);
  });
};

export const summaryCommentsAdd = () => {
  cy.get("textarea").clear().invoke("val", loremIpsum1k).trigger("input");
  cy.get("textarea").type("{moveToEnd}").type("t");
  cy.get("textarea").type("{backSpace}");
  cy.paragraph("You have 0 characters remaining");
};

export const summaryCommentsTooMany = () => {
  cy.get("textarea").type("{moveToEnd}").type("t");
  cy.paragraph("You have 1 character too many");
  cy.button("Save and return").click();
  cy.validationLink("Comments must be a maximum of 1000 characters");
};

export const summaryCommentsDeleteOne = () => {
  cy.get("textarea").type("{moveToEnd}");
  cy.get("textarea").type("{backSpace}");
  cy.paragraph("You have 0 characters remaining");
};

export const summaryReaccessClaim = () => {
  cy.get("a").contains("Edit").click();
  cy.heading("Costs to be claimed");
  cy.button("Continue to claims documents").click();
  cy.heading("Claim documents");
  cy.get("a").contains("Continue to update forecast").click();
  cy.heading("Update forecast");
  cy.button("Continue to summary").click();
  cy.heading("Claim summary");
  cy.get("textarea").should("have.value", loremIpsum1k);
};

export const summaryAccessDocsDelete = () => {
  cy.get("a").contains("Edit claim documents").click();
  cy.heading("Claim documents");
  fileTidyUp("James Black");
};

export const summaryClearCommentsSave = () => {
  cy.get("textarea").clear();
  cy.button("Save and return to claims").click();
  cy.heading("Claims");
};

export const summaryUpdateCostsClaimed = () => {
  cy.get("a").contains("Edit costs to be claimed").click();
  cy.heading("Costs to be claimed");
  cy.get("a").contains("Labour").click();
  cy.heading("Labour");
  cy.get("a").contains("Add a cost").click();
  cy.get("#description0").type("Test cost");
  cy.get("#value0").type("1000");
  cy.wait(500);
  cy.button("Save and return to claims").click();
  cy.heading("Costs to be claimed");
  cy.button("Continue to claims documents").click();
  cy.heading("Claim documents");
  cy.get("a").contains("Continue to update forecast").click();
  cy.heading("Update forecast");
  cy.button("Continue to summary").click();
  cy.heading("Claim summary");
  cy.getListItemFromKey("Total costs to be claimed").contains("£281,200.00");
};

export const summaryClearCostCats = () => {
  cy.get("a").contains("Edit costs to be claimed").click();
  cy.heading("Costs to be claimed");
  cy.get("a").contains("Labour").click();
  cy.heading("Labour");
  cy.get("a").contains("Remove").click();
  cy.button("Save and return to claims").click();
  cy.heading("Costs to be claimed");
  cy.get("a").contains("Overheads").click();
  cy.get("a").contains("Remove").click();
  cy.button("Save and return to claims").click();
};

export const summaryCheckForCostRemoval = () => {
  cy.button("Continue to claims documents").click();
  cy.heading("Claim documents");
  cy.get("a").contains("Continue to update forecast").click();
  cy.heading("Update forecast");
  cy.button("Continue to summary").click();
  cy.heading("Claim summary");
};

export const accessABCadClaim = () => {
  cy.selectTile("Claims");
  cy.heading("Claims");
  cy.get("a").contains("Edit").click();
  cy.heading("Costs to be claimed");
};

export const grantRetentionMessage = () => {
  cy.validationNotification(
    "Please be aware, approval of this claim will cause a percentage of your grant to be retained. Innovate UK will retain a portion of the grant value due for this project until the project is completed (as per the terms & conditions of your grant offer letter). To check your current retained balance, please see the financial summary area of your project dashboard.",
  );
  cy.validationNotification("This is the final claim.");
};

export const sbriCostCats = () => {
  [
    "Labour",
    "Overheads",
    "Materials",
    "Capital usage",
    "Subcontracting",
    "Travel and subsistence",
    "Other costs",
    "VAT",
  ].forEach((costCat, index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(costCat);
      });
  });
};

export const sbriDocGuidance = () => {
  cy.paragraph("You need to upload the following documents here:");
  cy.paragraph("Contact your monitoring officer for more information about what you need to provide.");
  [
    "VAT invoices with every claim by partners registered for value-added tax (VAT)",
    "non-VAT invoices with every claim by partners not registered for VAT",
    "any documents requested by your monitoring officer to support a claim",
  ].forEach(list => {
    cy.get("li").contains(list);
  });
};

export const sbriFinalDocGuidance = () => {
  [
    "You need to complete our short survey about the project before we can make your final payment:",
    "You need to upload the following documents here:",
    "Contact your monitoring officer for more information about what you need to provide.",
  ].forEach(paragraph => {
    cy.paragraph(paragraph);
  });
  [
    "Complete our survey",
    "Download a copy of your completed survey and upload it on this page.",
    "VAT invoices with every claim by partners registered for value-added tax (VAT)",
    "non-VAT invoices with every claim by partners not registered for VAT",
    "any documents requested by your monitoring officer to support a claim",
  ].forEach(list => {
    cy.get("li").contains(list);
  });
};

export const correctClaimGuidance = () => {
  cy.paragraph(
    "In order to submit your final claim you need to submit your Project Impact questions. An email has been sent to the Finance Contact on the Project with a link to review and update the Project Impact questions.",
  );
  cy.paragraph(
    "If you need more information or help to complete your Project Impact questions, see the Project Impact guidance in the ",
  );
  cy.paragraph(". Alternatively, you can contact our customer support service by calling 0300 321 4357 or email ");
  cy.get("a").contains("Innovate UK Guidance for applicants");
  cy.get("a").contains("support@iuk.ukri.org");
};

export const sbriAccessABSClaim = () => {
  cy.selectTile("Claims");
  cy.heading("Claims");
  cy.paragraph(
    "You must upload an invoice with every claim. VAT invoices are required from partners registered for value-added tax (VAT).",
  );
  cy.get("a").contains("Edit").click();
  cy.heading("Costs to be claimed");
};

export const sbriCorrectForecastCostCat = () => {
  [
    "Labour",
    "Overheads",
    "Materials",
    "Capital usage",
    "Subcontracting",
    "Travel and subsistence",
    "Other costs",
    "VAT",
  ].forEach((costCat, index) => {
    cy.get("tr")
      .eq(index + 4)
      .within(() => {
        cy.get("td:nth-child(1)").contains(costCat);
      });
  });
};

export const iarProceedToDocs = () => {
  cy.switchUserTo("s.shuang@irc.trde.org.uk.test");
  cy.selectTile("Claims");
  cy.get("td").contains("Period 1").siblings().contains("a", "Edit").click();
  cy.heading("Costs to be claimed");
  cy.button("Continue to claims documents").click();
  cy.heading("Claim documents");
};

export const iarGuidance = () => {
  cy.paragraph(
    "An Independent Accountant's Report (IAR) must be uploaded to support the claim before it can be submitted to Innovate UK. If your total grant value is £50,000 or under, a Statement of Expenditure (SoE) may be sufficient. Your monitoring officer will be able to confirm which document is needed.",
  );
  cy.paragraph(
    "Upload your IAR or SoE in the claim documents, selecting the IAR document type (for both) and then proceed to submit your claim.",
  );
};

export const iarSubmitValidate = () => {
  cy.get("a").contains("Continue to update forecast").click();
  cy.heading("Update forecast");
  cy.button("Continue to summary").click();
  cy.heading("Claim summary");
  cy.button("Submit claim").click();
  cy.validationLink("You must upload an independent accountant's report before you can submit this claim.");
};

export const uploadIAR = () => {
  cy.get("select#description.govuk-select").select("Independent accountant’s report");
  cy.fileInput(testFile);
  cy.button("Upload documents").click();
  cy.validationNotification("has been uploaded.");
};

export const iarProceedToSummary = () => {
  cy.get("a").contains("Continue to update forecast").click();
  cy.heading("Update forecast");
  cy.button("Continue to summary").click();
  cy.heading("Claim summary");
};

export const finalClaimPcfGuidance = () => {
  cy.validationNotification("This is the final claim.");
  cy.paragraph("You need to complete our short survey about the project before we can make your final payment:");
  ["Complete our survey.", "Download a copy of your completed survey and upload it on this page."].forEach(li => {
    cy.get("li").contains(li);
  });
};

export const impactGuidance = () => {
  cy.paragraph(
    "In order to submit your final claim you need to submit your Project Impact questions. An email has been sent to the Finance Contact on the Project with a link to review and update the Project Impact questions.",
  );
  cy.paragraph(
    "If you need more information or help to complete your Project Impact questions, see the Project Impact guidance in the ",
  );
  cy.paragraph(". Alternatively, you can contact our customer support service by calling 0300 321 4357 or email ");
  cy.get("a").contains("Innovate UK Guidance for applicants");
  cy.get("a").contains("support@iuk.ukri.org");
};

export const uploadProjectCompletionForm = () => {
  cy.get("select#description.govuk-select").select("Project completion form");
  cy.fileInput(testFile);
  cy.button("Upload documents").click();
  cy.validationNotification("has been uploaded.");
};
