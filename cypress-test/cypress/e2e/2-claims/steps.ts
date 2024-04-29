import { claimReviewFileTidyUp, fileTidyUp } from "common/filetidyup";
import { loremIpsum1k } from "common/lorem";
import { seconds } from "common/seconds";
import { testFile, testFileEUIFinance } from "common/testfileNames";
let date = new Date();
let comments = JSON.stringify(date);

export const uploadDate = new Date().getFullYear().toString();

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
    ].forEach(([costCat, eligibleCosts, claimedThisPeriod, remainingEligibleCosts], rowNumber = 0) => {
      cy.getCellFromHeaderAndRow("Total eligible costs", costCat).contains(eligibleCosts);
      cy.getCellFromHeaderAndRow("Costs claimed this period", costCat).contains(claimedThisPeriod);
      cy.getCellFromHeaderAndRow("Remaining eligible costs", costCat).contains(remainingEligibleCosts);
    });
};

export const shouldShowCostsClaimedToDateTable = () => {
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
  ].forEach(([costCat, eligibleCosts, claimedToDate, remainingEligibleCosts]) => {
    cy.getCellFromHeaderAndRow("Total eligible costs", costCat).contains(eligibleCosts);
    cy.getCellFromHeaderAndRow("Eligible costs claimed to date", costCat).contains(claimedToDate);
    cy.getCellFromHeaderAndRow("Remaining eligible costs", costCat).contains(remainingEligibleCosts);
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
  ["Description", "Cost (£)", "Last updated", "Total costs", "Forecast costs", "Difference"].forEach(header => {
    cy.tableHeader(header);
  });
};

export const costCatTableFooter = () => {
  [
    ["Total costs", "£12,000.00"],
    ["Forecast costs", "£35,000.00"],
    ["Difference", "-65.71%"],
  ].forEach(([col1, col2], index) => {
    cy.get("tfoot").within(() => {
      cy.get("tr")
        .eq(index)
        .within(() => {
          cy.get(`th:nth-child(1)`).contains(col1);
          cy.get(`td:nth-child(2)`).contains(col2);
          index + 1;
        });
    });
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
      if ($table.find("tr").length > 4) {
        cy.clickOn("Remove", { multiple: true });
      }
    });
  cy.clickOn("Add a cost");
  cy.wait(200);
  cy.getByAriaLabel("Description of claim line item 0").clear().type("Test line item");
  cy.getByAriaLabel("Cost of claim line item 0").clear().type("1000").wait(800);
};

export const allowFileUpload = () => {
  cy.fileInput("testfile.doc");
  cy.clickOn("button", "Upload documents");
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

export const reflectCostAdded = () => {
  cy.get("tr.govuk-table__row").contains("Labour");
  cy.get("span.currency").contains("£1,000.00");
};

export const clearUpLabourCostCat = () => {
  cy.wait(3000);
  cy.clickOn("Upload and remove documents");
  cy.heading("Labour documents");
  cy.clickOn("Remove");
  cy.wait(1000);
  cy.get("a.govuk-back-link").click();
  cy.heading("Labour");
  cy.clickOn("Remove");
  cy.get("textarea").should("have.value", standardComments);
  cy.get("textarea").clear();
};

export const clearUpOverheadsCostCat = () => {
  cy.get("td.govuk-table__cell").contains("Overheads").click();
  cy.heading("Overheads");
  cy.clickOn("Remove");
};

export const evidenceRequiredMessage = () => {
  cy.get("h2").contains("Supporting documents");
  cy.getByQA("section-content").contains("Upload evidence of the costs");
  cy.get("h2").contains("Files uploaded");
  cy.paragraph("No documents uploaded");
};

export const additionalInformationHeading = () => {
  cy.get("legend").contains("Additional information");
  cy.get(".govuk-hint").contains("Explain any difference");
};

export const returnToCostCatPage = () => {
  cy.clickOn("Save and return to claims");
};

export const selectFileDescription = () => {
  ["10", "30", "60", "110", "120", "210", "220"].forEach(selection => {
    cy.get("select#description").select(selection);
  });
};

export const claimsDocUpload = () => {
  cy.clickOn("Upload documents");
  cy.validationLink("Choose a file to upload");
  cy.fileInput("testfile.doc");
  cy.clickOn("Upload documents");
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
    cy.getListItemFromKey(key, item);
  });
};

export const claimCommentBox = () => {
  cy.get("legend").contains("Add comments");
  cy.get("textarea").clear();
  cy.paragraph("You have 1000 characters remaining");
};

export const savedFromPrev = () => {
  cy.getByAriaLabel("Labour Period 2").should("have.value", "33.33");
  cy.get("tr")
    .eq(4)
    .within(() => {
      cy.get("td:nth-child(14)").contains("£33.33");
    });
  cy.getByAriaLabel("Overheads Period 2").contains("£6.67");
};

export const openClosedSection = () => {
  cy.get("h2").contains("Open");
  cy.get("h2").contains("Closed");
  cy.paragraph("There are no open claims.");
  cy.paragraph("There are no closed claims for this partner.");
};

export const ktpGuidance = () => {
  [
    "You must upload a Schedule 3 with this claim.",
    "Useful tip: you can use this page to upload and store all your claim support documents for this project.",
    "For KTP claims, you must upload one of these claim approval documents",
    "LMC minutes",
    "LMC virtual approval",
  ].forEach(ktpDocGuidance => {
    cy.getByQA("iarText").contains(ktpDocGuidance);
  });
};

export const ktpGuidanceWithoutSchedule3 = () => {
  [
    "Useful tip: you can use this page to upload and store all your claim support documents for this project.",
    "For KTP claims, you must upload one of these claim approval documents",
    "LMC minutes",
    "LMC virtual approval",
  ].forEach(ktpDocGuidance => {
    cy.getByQA("iarText").contains(ktpDocGuidance);
  });
};

export const ktpForecastCategories = () => {
  cy.clickOn("Continue to update forecast");
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
    cy.get("td:nth-child(1)").contains(ktpCostCat);
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

export const nonFECMessaging = () => {
  [
    "This claim does not follow the normal grant calculation rules (costs claimed × funding award rate).",
    "This claim may have one or more cost categories paid at a different funding award rate compared to your overall funding award rate.",
  ].forEach(guidance => {
    cy.validationNotification(guidance);
  });
};

export const nonFECMessagingFinalClaim = () => {
  [
    "This project does not follow the normal grant calculation rules (costs claimed × funding award rate).",
    "The project and any partner may have one or more cost categories paid at a different funding award rate compared to your overall funding award rate.",
  ].forEach(guidance => {
    cy.validationNotification(guidance);
  });
};

export const costCatAwardOverrideMessage = (costCat: string, percentage: string) => {
  cy.list(`Cost category ${costCat} is paid at a rate of ${percentage} rather than your normal award rate`);
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
  cy.wait(seconds(1)).get("button").contains("Show all sections").click();

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
  cy.get("#hint-for-comments").contains(
    "If you query the claim, you must explain what the partner needs to amend. If you approve the claim, you may add a comment to Innovate UK in support of the claim.",
  );
  cy.get("textarea").clear().type(comments);
  cy.paragraph("You have");
  cy.paragraph("I am satisfied that the costs claimed appear to comply");
  cy.getByQA("reminder").contains("You must submit a monitoring report");
  cy.clickOn("Send query");
  cy.heading("Claims");
};

export const navigateBackToDash = () => {
  cy.clickOn("Back to project");
  cy.heading("Project overview");
};

export const goToQueriedClaim = () => {
  cy.selectTile("Claims");
  cy.contains("td", "Queried by Monitoring Officer").siblings().contains("a", "Edit").click();
  cy.heading("Costs to be claimed");
  cy.get("td").contains(comments);
  cy.clickOn("Continue to claims documents");
};

export const beginEditing = () => {
  cy.clickOn("Edit");
  cy.heading("Costs to be claimed");
  cy.clickOn("a", "Labour");
  cy.heading("Labour");
};

export const add120Lines = () => {
  cy.clickOn("Add a cost");
  cy.wait(500);
  cy.getByQA("current-claim-summary-table")
    .find(`[data-qa="input-row"]`)
    .then($rows => {
      let numberOfRows = $rows.length;
      cy.log(numberOfRows.toString());
      if (numberOfRows > 1) {
        for (let i = 0; i < numberOfRows; numberOfRows--) {
          cy.get("tr")
            .eq(numberOfRows)
            .within(() => {
              cy.clickOn("Remove");
            });
        }
        cy.clickOn("Save and return to claims");
        cy.heading("Costs to be claimed");
        cy.clickOn("Labour");
        cy.heading("Labour");
        for (let i = 0; i < 119; i++) {
          cy.clickOn("Add a cost");
          cy.get(`#lineItems_${i}_description`).type(`Labour${i}`);
          cy.get(`#lineItems_${i}_value`).type("100");
        }
        cy.get(`#lineItems_119_description`).type(`Labour119`);
        cy.get(`#lineItems_119_value`).type("100");
        cy.button("Add a cost").should("not.exist");
      } else {
        for (let i = 0; i < 119; i++) {
          cy.clickOn("Add a cost");
          cy.get(`#lineItems_${i}_description`).type(`Labour${i}`);
          cy.get(`#lineItems_${i}_value`).type("100");
        }
        cy.get(`#lineItems_119_description`).type(`Labour119`);
        cy.get(`#lineItems_119_value`).type("100");
        cy.button("Add a cost").should("not.exist");
      }
    });
};

export const saveLineItems = () => {
  cy.clickOn("Save and return to claims");
  cy.wait(5000);
  cy.get("h1").contains("Costs to be claimed", { timeout: 60000 });
};

export const removeLineItems = () => {
  cy.getByQA("current-claim-summary-table")
    .find(`[data-qa="input-row"]`)
    .then($rows => {
      let numberOfRows = $rows.length;
      cy.log(numberOfRows.toString());
      if (numberOfRows > 2) {
        for (let i = 0; i < numberOfRows; numberOfRows--) {
          cy.get("tr")
            .eq(numberOfRows)
            .within(() => {
              cy.clickOn("Remove");
            });
        }
      } else {
        cy.heading("Labour");
      }
    });
};

export const validateLineItem = () => {
  cy.get("tr")
    .eq(1)
    .within(() => {
      cy.get("td:nth-child(2)").within(() => {
        cy.get("input").clear().type("gsdfadsf").wait(500);
      });
    });
  cy.clickOn("Save and return to claims");

  cy.validationLink("Costs must be a number");
  cy.get("tr")
    .eq(1)
    .within(() => {
      cy.get("td:nth-child(2)").within(() => {
        cy.get("input").clear().type("1000").wait(500);
      });
    });
};

export const validateForecast = () => {
  cy.getByAriaLabel("Labour Period 2").clear().wait(500);
  cy.clickOn("Save and return to claims");
  cy.validationLink("Forecast is required");
};

export const academicForecastNavigate = () => {
  cy.clickOn("Back to claim");
  cy.heading("Costs to be claimed");
  cy.clickOn("Continue to claims documents");
  cy.heading("Claim documents");
  cy.clickOn("Continue to update forecast");
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
  cy.get("main").within(() => {
    cy.getByQA("validation-message-content").should("not.exist");
  });
};

export const triggerCapPot = () => {
  ["Labour", "Materials"].forEach(costCat => {
    cy.clickOn(costCat);
    cy.heading(costCat);
    cy.clickOn("Add a cost");
    cy.getCellFromHeaderAndRowNumber("Description", 1, `[aria-label="Description of claim line item 0"]`)
      .clear()
      .type(`Test line item`);
    cy.getCellFromHeaderAndRowNumber("Cost", 1, `[aria-label="Cost of claim line item 0"]`)
      .clear()
      .type("7200.50")
      .wait(800);
    cy.clickOn("Save and return to claims");
    cy.heading("Costs to be claimed");
  });
};

export const saveAndReturnToPrepare = () => {};

export const capPotMessageDoesExist = () => {
  cy.validationNotification(
    "Please be aware, approval of this claim will cause a percentage of your grant to be retained.",
  );
};

export const reduceToBelowCapLimit = () => {
  cy.clickOn("Labour");
  cy.heading("Labour");
  cy.getCellFromHeaderAndRowNumber("Cost", 1, `[aria-label="Cost of claim line item 0"]`)
    .clear()
    .type("7199.50")
    .wait(800);
  cy.clickOn("Save and return to claims");
  cy.heading("Costs to be claimed");
};

export const clearCostCatReturn = () => {
  ["Labour", "Materials"].forEach(costCat => {
    cy.clickOn("a", costCat);
    cy.heading(costCat);
    cy.clickOn("Remove");
    cy.clickOn("Save and return to claims");
    cy.get("h1").contains("Costs to be claimed");
  });
};

export const acceptLabourCalculateOH = () => {
  [
    [-10000, -2000],
    [-888, -177.6],
    [-66666, -13333.2],
    [-3333, -666.6],
    [0, 0],
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
    cy.getByAriaLabel("Overheads Period 2").should("have.text", newCurrency.format(overhead));
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

export const ktpTopThreeRows = () => {
  [
    ["Period", "1", "2", "3", "4"],
    ["Schedule 3 Due", "Yes", "No", "No", "No"],
    ["Month", "Feb to Apr 2023", "May to Jul 2023", "Aug to Oct 2023", "Nov 2023 to Jan 2024"],
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
  cy.get("#ifspa-forecast-table").within(() => {
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
  cy.getByQA("upload-supporting-documents-form-accordion").within(() => {
    cy.get("h2").contains("Supporting documents");
    cy.paragraph("You can upload and store any documents for this claim on this page.");
    cy.paragraph(
      "You will also be able to see any documents added to the claim by the finance contact and Innovate UK.",
    );
  });
};

export const claimReviewExistingEvidence = () => {
  claimReviewFileTidyUp("Javier Baez");
  [
    ["testfile.doc", "Independent accountant’s report", uploadDate, "0KB", "Sarah Shuang"],
    ["Sheet1.xlsx", "Claim evidence", "4 Sep 2023", "6KB", "Innovate UK"],
    ["t10.pdf", "Claim evidence", "20 Mar 2023", "6KB", "Innovate UK"],
    ["Sheet3.xlsx", "Claim evidence", "20 Mar 2023", "6KB", "Innovate UK"],
    ["Sheet2.xlsx", "Claim evidence", "20 Mar 2023", "6KB", "Innovate UK"],
  ].forEach(([claimDoc, type, date, size, uploadBy], rowNumber = 1) => {
    cy.getByQA("upload-supporting-documents-form-accordion").within(() => {
      cy.get("tr")
        .eq(rowNumber + 1)
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
  cy.get("#ifspa-forecast-table").within(() => {
    costCategories.forEach(forecastCostCat => {
      cy.tableCell(forecastCostCat);
    });
    cy.tableHeader("Total");
  });
};

export const claimReviewForecastCostsClaiming = () => {
  cy.get("#ifspa-forecast-table").within(() => {
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
    ["£1,500.00", "£10,000.00", "-85.00%"],
    ["£1,600.00", "£10,000.00", "-84.00%"],
    ["£1,700.00", "£10,000.00", "-83.00%"],
    ["£1,800.00", "£10,000.00", "-82.00%"],
    ["£1,900.00", "£10,000.00", "-81.00%"],
    ["£2,000.00", "£10,000.00", "-80.00%"],
  ].forEach((cols, index) => {
    cy.get("#ifspa-forecast-table").within(() => {
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
  cy.clickOn("Upload documents");
  cy.validationNotification("Your document has been uploaded");
};

export const claimReviewCheckForNewDoc = () => {
  cy.getByQA("upload-supporting-documents-form-accordion").within(() => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("td:nth-child(1)").contains("testfile.doc");
        cy.get("td:nth-child(2)").contains("Invoice");
        cy.get("td:nth-child(3)").contains(uploadDate);
        cy.get("td:nth-child(4)").contains("0KB");
        cy.get("td:nth-child(5)").contains("Javier Baez");
      });
  });
};

export const claimQueriedCheckForDoc = () => {
  ["testfile.doc", "Invoice", uploadDate, "0KB", "Javier Baez"].forEach(fileDetails => {
    cy.get("tr").contains(fileDetails);
  });
};

export const claimReviewResubmit = () => {
  cy.clickOn("Continue to update forecast");
  cy.clickOn("Continue to summary");
  cy.clickOn("Submit claim");
};

export const claimReviewDeleteDoc = () => {
  cy.getByQA("upload-supporting-documents-form-accordion").within(() => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.button("Remove").click();
      });
  });
  cy.button("Remove").should("be.disabled");
  cy.validationNotification("has been removed.");
};

export const summaryTotalCostsList = () => {
  [
    ["Total costs to be claimed", "£280,000.00"],
    ["Funding level", "65.00%"],
    ["Total costs to be paid", "£182,000.00"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
};

export const summaryCommentsAdd = () => {
  cy.get("textarea").clear().invoke("val", loremIpsum1k).trigger("input");
  cy.get("textarea").type("{moveToEnd}").type("t");
  cy.get("textarea").type("{backSpace}");
  cy.paragraph("You have 0 characters remaining");
};

export const loansSummaryCommentsTooMany = () => {
  cy.get("textarea").type("{moveToEnd}").type("t");
  cy.paragraph("You have 1 character too many");
  cy.clickOn("Save and return to project costs");
  cy.validationLink("Comments must be a maximum of 1000 characters");
};

export const summaryCommentsTooMany = () => {
  cy.get("textarea").type("{moveToEnd}").type("t");
  cy.paragraph("You have 1 character too many");
  cy.clickOn("Save and return to claims");
  cy.validationLink("Comments must be a maximum of 1000 characters");
};

export const summaryCommentsDeleteOne = () => {
  cy.get("textarea").type("{moveToEnd}");
  cy.get("textarea").type("{backSpace}");
  cy.paragraph("You have 0 characters remaining");
};

export const summaryReaccessClaim = () => {
  cy.clickOn("Edit");
  cy.heading("Costs to be claimed");
  cy.clickOn("Continue to claims documents");
  cy.heading("Claim documents");
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
  cy.clickOn("Continue to summary");
  cy.heading("Claim summary");
  cy.get("textarea").should("have.value", loremIpsum1k);
};

export const summaryAccessDocsDelete = () => {
  cy.clickOn("Edit claim documents");
  cy.heading("Claim documents");
  fileTidyUp("James Black");
};

export const summaryClearCommentsSave = () => {
  cy.get("textarea").clear();
  cy.clickOn("Save and return to claims");
  cy.heading("Claims");
};

export const summaryUpdateCostsClaimed = () => {
  cy.clickOn("Edit costs to be claimed");
  cy.heading("Costs to be claimed");
  cy.clickOn("a", "Labour");
  cy.heading("Labour");
  cy.clickOn("Add a cost");
  cy.get("#lineItems_0_description").type("Test cost");
  cy.get("#lineItems_0_value").type("1000");
  cy.wait(500);
  cy.clickOn("Save and return to claims");
  cy.heading("Costs to be claimed");
  cy.clickOn("Continue to claims documents");
  cy.heading("Claim documents");
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
  cy.clickOn("Continue to summary");
  cy.heading("Claim summary");
  cy.getListItemFromKey("Total costs to be claimed", "£281,200.00");
};

export const summaryClearCostCats = () => {
  cy.clickOn("Edit costs to be claimed");
  cy.heading("Costs to be claimed");
  cy.clickOn("a", "Labour");
  cy.heading("Labour");
  cy.clickOn("Remove");
  cy.clickOn("Save and return to claims");
  cy.heading("Costs to be claimed");
  cy.clickOn("Overheads");
  cy.clickOn("Remove");
  cy.clickOn("Save and return to claims");
};

export const summaryCheckForCostRemoval = () => {
  cy.clickOn("Continue to claims documents");
  cy.heading("Claim documents");
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
  cy.clickOn("Continue to summary");
  cy.heading("Claim summary");
};

export const accessABCadClaim = () => {
  cy.selectTile("Claims");
  cy.heading("Claims");
  cy.clickOn("Edit");
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

export const sbriAccessABSClaim = () => {
  cy.selectTile("Claims");
  cy.heading("Claims");
  cy.paragraph(
    "You must upload an invoice with every claim. VAT invoices are required from partners registered for value-added tax (VAT).",
  );
  cy.clickOn("Edit");
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
  cy.clickOn("Continue to claims documents");
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
  impactGuidance();
  cy.clickOn("Submit claim");
  cy.validationLink("You must upload an independent accountant's report before you can submit this claim.");
};

export const uploadIAR = () => {
  cy.get("select#description.govuk-select").select("Independent accountant’s report");
  cy.fileInput(testFile);
  cy.clickOn("Upload documents");
  cy.validationNotification("has been uploaded.");
};

export const iarProceedToSummary = () => {
  cy.clickOn("Continue to summary");
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
  ).should("not.exist");
  cy.paragraph(
    "If you need more information or help to complete your Project Impact questions, see the Project Impact guidance in the ",
  ).should("not.exist");
  cy.paragraph(
    ". Alternatively, you can contact our customer support service by calling 0300 321 4357 or email ",
  ).should("not.exist");
  cy.get("a").contains("Innovate UK Guidance for applicants").should("not.exist");
  cy.get("a").contains("support@iuk.ukri.org").should("not.exist");
};

export const summaryDocTable = () => {
  ["File name", "Type", "Date uploaded", "Size", "Uploaded by"].forEach((header, index) => {
    cy.get(`th:nth-child(${index + 1})`).contains(header);
  });
  documents.forEach(doc => {
    cy.get("td:nth-child(1)").contains(doc);
  });
  cy.get("tr")
    .eq(1)
    .within(() => {
      [testFileEUIFinance, "Schedule 3", uploadDate, "0KB", "James Black"].forEach((rowDetail, index) => {
        cy.get(`td:nth-child(${index + 1})`).contains(rowDetail);
      });
    });
};

export const updateClaimsForecast = () => {
  let totalCell = (rowNum: number, value: string) => {
    cy.get("tr")
      .eq(rowNum)
      .within(() => {
        cy.get("td:nth-child(14)").contains(value);
      });
  };

  for (let inputNum = 2; inputNum < 13; inputNum++) {
    let baseTotal = 35000 + inputNum * 100 - 100;
    let labourTotal = 0 + inputNum * 100 - 100;
    let subcontractingTotal = 0 + inputNum * 100 - 100;
    let totalString = baseTotal.toLocaleString("en-UK");
    let labourtotalString = labourTotal.toLocaleString("en-GB");
    let subcontractingString = subcontractingTotal.toLocaleString("en-GB");
    [
      [`Labour Period ${inputNum}`, "4", `£${labourtotalString}.00`],
      [`Materials Period ${inputNum}`, "6", `£${totalString}.00`],
      [`Capital usage Period ${inputNum}`, "7", `£${totalString}.00`],
      [`Subcontracting Period ${inputNum}`, "8", `£${subcontractingString}.00`],
      [`Travel and subsistence Period ${inputNum}`, "9", `£${totalString}.00`],
      [`Other costs Period ${inputNum}`, "10", `£${totalString}.00`],
      [`Other costs 2 Period ${inputNum}`, "11", `£${totalString}.00`],
      [`Other costs 3 Period ${inputNum}`, "12", `£${totalString}.00`],
      [`Other costs 4 Period ${inputNum}`, "13", `£${totalString}.00`],
      [`Other costs 5 Period ${inputNum}`, "14", `£${totalString}.00`],
    ].forEach(([costCat, row, total]) => {
      cy.getByAriaLabel(costCat).clear().type("100");
      cy.wait(200);
      totalCell(Number(row), total);
    });
  }
  const percentages = [
    "-96.86%",
    "-99.37%",
    "3.14%",
    "3.14%",
    "0.00%",
    "3.14%",
    "3.14%",
    "3.14%",
    "3.14%",
    "3.14%",
    "3.14%",
  ];
  let percentage = 0;
  for (let i = 4; i < 12; i++) {
    cy.get("tr")
      .eq(i)
      .within(() => {
        cy.get("td:nth-child(16)").contains(percentages[percentage]);
        percentage += 1;
      });
  }
  for (let i = 2; i < 12; i++) {
    cy.get("tr")
      .eq(15)
      .within(() => {
        cy.get(`td:nth-child(${i + 2})`).contains("£1,020.00");
      });
  }
  cy.get("tr")
    .eq(15)
    .within(() => {
      cy.get("td:nth-child(14)").contains("£291,220.00");
    });
  cy.reload();
};

export const reviewLabourFCCopy = () => {
  cy.get("a").contains("Labour").click();
  cy.heading("Labour");
  ["guidance-message", "guidance-currency-message", "claim-warning-content"].forEach(qaTag => {
    cy.getByQA(qaTag).should("not.exist");
  });
  [
    "You must break down your total costs and upload evidence for each expenditure you are claiming for. Contact your monitoring officer for more information about the level of detail you are required to provide.",
    "You can enter up to 120 separate lines of costs and you must convert any foreign currency amounts to pounds sterling (GBP) before you enter them into your claim.",
  ].forEach(copy => {
    cy.paragraph(copy).should("not.exist");
  });
};

export const reviewLabourCostCat = () => {
  ["Description", "Cost (£)", "Last updated"].forEach(header => {
    cy.tableHeader(header);
  });
  [
    ["Carpenters", "£1,000.00", "2023"],
    ["Electricians", "£1,000.00", "2023"],
  ].forEach(([description, value, date], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get(`td:nth-child(1)`).contains(description);
        cy.get(`td:nth-child(2)`).contains(value);
        cy.get(`td:nth-child(3)`).contains(date);
      });
  });
  [
    ["Total costs", "£2,000.00"],
    ["Forecast costs", "£0.00"],
    ["Difference", "0.00%"],
  ].forEach(([col1, col2], index) => {
    cy.get("tfoot").within(() => {
      cy.get("tr")
        .eq(index)
        .within(() => {
          cy.get(`th:nth-child(1)`).contains(col1);
          cy.get(`td:nth-child(2)`).contains(col2);
          index + 1;
        });
    });
  });
};

export const reviewLabourDocUpload = () => {
  cy.get("h2").contains("Supporting documents");
  cy.paragraph("All documents uploaded will be shown here. All documents open in a new window.");
  cy.getByQA("claim-line-item-documents-container").within(() => {
    ["File name", "Type", "Date uploaded", "Size", "Uploaded by"].forEach(header => {
      cy.tableHeader(header);
    });
    ["Sheet1.xlsx", "Claim evidence", "4 Sep 2023", "6KB", "Innovate UK"].forEach((fileCell, index) => {
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get(`td:nth-child(${index + 1})`).contains(fileCell);
        });
    });
  });
};

export const reviewLabourRightLeft = () => {
  cy.getByQA("arrow-right").contains("Subcontracting");
  cy.getByQA("arrow-right").contains("Previous");
  cy.getByQA("arrow-left").contains("Materials");
  cy.getByQA("arrow-left").contains("Next");
  cy.clickOn("Back to claim");
  cy.heading("Claim");
};

export const accessClaimNavigateToForecastPage = () => {
  cy.get("td").contains("Period 1").siblings().contains("a", "Edit").click();
  cy.heading("Costs to be claimed");
  cy.clickOn("Continue to claims documents");
  cy.heading("Claim documents");
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
};

export const forecastShowsIARDue = () => {
  cy.heading("Update forecast");
  cy.get("tr")
    .eq(2)
    .within(() => {
      cy.get("th:nth-child(2)").should("have.text", "Yes");
    });
};

export const forecastShowsIARNotDue = () => {
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
  cy.get("tr")
    .eq(2)
    .within(() => {
      cy.get("th:nth-child(2)").should("have.text", "No");
    });
};

export const exceedGolAccessClaim = () => {
  cy.switchUserTo("s.shuang@irc.trde.org.uk.test");
  cy.selectTile("Claims");
  cy.get("td").contains("Period 1").siblings().contains("a", "Edit").click();
  cy.heading("Costs to be claimed");
  cy.wait(1000);
};

export const exceedOtherCosts5 = () => {
  cy.get("a").contains("Other costs 5").click();
  cy.heading("Other costs 5");
  cy.getByAriaLabel("Cost of claim line item 0").clear();
  cy.getByAriaLabel("Cost of claim line item 0").type("91001");
  cy.clickOn("Save and return to claims");
  cy.heading("Costs to be claimed");
};

export const cleanUpOtherCosts5 = () => {
  cy.get("a").contains("Edit costs to be claimed").click();
  cy.heading("Costs to be claimed");
  cy.get("a").contains("Other costs 5").click();
  cy.heading("Other costs 5");
  cy.getByAriaLabel("Cost of claim line item 0").clear();
  cy.getByAriaLabel("Cost of claim line item 0").type("2100");
  cy.clickOn("Save and return to claims");
  cy.heading("Costs to be claimed");
};

export const cleanUpExceedGolDocs = () => {
  cy.clickOn("Continue to claims documents");
  cy.heading("Claim documents");
  fileTidyUp("Sarah Shuang");
};

export const cleanUpExceedGolForecast = () => {
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
  cy.getByAriaLabel("Other costs 5 Period 2").clear();
  cy.getByAriaLabel("Other costs 5 Period 2").type("0");
  cy.clickOn("Save and return to claims");
  cy.heading("Claims");
};

export const backOutToClaimsPage = () => {
  cy.clickOn("Back to Exceptions - Staff");
  cy.heading("Exceptions - Staff");
  cy.clickOn("Back to claim");
  cy.heading("Costs to be claimed");
  cy.clickOn("Exceptions - Equipment");
  cy.heading("Exceptions - Equipment");
};

export const downloadExceptionsStaff = () => {
  cy.readFile("cypress/documents/testfileEUIpm.doc", "base64").then((base64: string) => {
    cy.getByQA("claim-line-item-documents-container")
      .contains("a", "testfileEUIpm.doc")
      .invoke("attr", "href")
      .then(href => cy.downloadFile(href))
      .should(obj => {
        expect(obj.headers["content-disposition"] ?? "").to.include("testfileEUIpm.doc");
        expect(obj.redirected).to.eq(false);
        expect(obj.status).to.eq(200);
        expect(obj.ok).to.eq(true);
        expect(obj.base64).to.eq(base64);
      });
  });
};

export const downloadExceptionsStaffDocPage = () => {
  cy.button("Upload and remove documents").click();
  cy.heading("Exceptions - Equipment documents");
  cy.readFile("cypress/documents/testfileEUIpm.doc", "base64").then((base64: string) => {
    cy.getByQA("claim-detail-documents-container")
      .contains("a", "testfileEUIpm.doc")
      .invoke("attr", "href")
      .then(href => cy.downloadFile(href))
      .should(obj => {
        expect(obj.headers["content-disposition"] ?? "").to.include("testfileEUIpm.doc");
        expect(obj.redirected).to.eq(false);
        expect(obj.status).to.eq(200);
        expect(obj.ok).to.eq(true);
        expect(obj.base64).to.eq(base64);
      });
  });
};
