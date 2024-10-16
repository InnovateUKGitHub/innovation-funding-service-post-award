const pmEmail = "james.black@euimeabs.test";
const fcEmail = "s.shuang@irc.trde.org.uk.test";

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";
import { newCurrency } from "common/currency";
import { fileTidyUp } from "common/filetidyup";
import { testFile } from "common/testfileNames";
import { visitApp } from "common/visit";
import { uploadDate } from "e2e/2-claims/steps";

const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
const cardId = "191431";

export const navigateToLoansProject = () => {
  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).wait(1000).contains("CYPRESS_LOANS_DO_NOT_USE").click({ force: true });
};

export const shouldShowAListOfProjectCards = () => {
  cy.get(projectCardCss).should("have.length.greaterThan", 5);
};

export const shouldNavigateToProjectOverview = () => {
  cy.get(`${projectCardCss} a`).contains(cardId).wait(500).click({ force: true });
};

export const shouldFindMatchingProjectCard = (projectCard: string) => {
  cy.get(".card-link h2").contains(projectCard);
};

export const drawdownCard = () => {
  cy.get("a").contains("Drawdowns").click();
  cy.heading("Drawdowns");
};

export const drawdownTable = () => {
  ["Drawdown", "Due date", "Drawdown amount", "Status"].forEach((header, index) => {
    cy.get("tr")
      .eq(0)
      .within(() => {
        cy.get(`th:nth-child(${index + 1})`).contains(header);
      });
  });
  [
    ["1", "1/02/2021", "£10,000", "Planned"],
    ["2", "01/08/2021", "£11,000", "Planned"],
    ["3", "01/11/2021", "£13,000", "Planned"],
    ["4", "01/02/2022", "£14,000", "Planned"],
    ["5", "01/05/2022", "£15,000", "Planned"],
    ["6", "01/08/2022", "£16,000", "Planned"],
    ["7", "01/11/2022", "£17,000", "Planned"],
    ["8", "01/02/2023", "£18,000", "Planned"],
  ].forEach(([drawdownNum, date, amount, status], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get(`td:nth-child(1)`).contains(drawdownNum);
        cy.get(`td:nth-child(2)`).contains(date);
        cy.get(`td:nth-child(3)`).contains(amount);
        cy.get(`td:nth-child(4)`).contains(status);
      });
  });
};

export const requestDrawdown = () => {
  cy.get("a").contains("Request").click();
  cy.heading("Drawdown");
};

export const viewDrawdown = () => {
  cy.get("a").contains("View").click();
  cy.heading("Drawdown");
};

export const fcDrawdownGuidance = () => {
  cy.paragraph(
    "You can request your drawdown here. If the amount of your drawdown needs to be changed, your Project Manager will need to submit a change drawdown project change request.",
  );
};

export const pmDrawdownGuidance = () => {
  cy.paragraph(
    "Your Finance Contact can request your drawdown here. If you need to change the amount of your drawdown, you will need to submit a change drawdown project change request.",
  );
  cy.get("a").contains("change drawdown");
};

/**
 * This needs updating to assert more accurately each cell and not just contents of the row.
 */
export const drawdownRequestTable = () => {
  [
    "Drawdown",
    "Due date",
    "Drawdown forecast",
    "Total loan",
    "Drawdown to date",
    "Drawdown amount",
    "Remaining loan",
  ].forEach((requestCat, index) => {
    cy.get("thead")
      .eq(0)
      .within(() => {
        cy.get(`th:nth-child(${index + 1})`).contains(requestCat);
      });
    ["1", "2021", "£10,000.00", "£115,000.00", "£0.00", "£10,000.00", "£105,000.00"].forEach((value, index) => {
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get(`td:nth-child(${index + 1})`).contains(value);
        });
    });
  });
};

export const uploadApprovalGuidance = () => {
  cy.get("h2").contains("Upload drawdown approval request");
  cy.paragraph("You must upload a signed drawdown approval request");
};

export const drawdownFileUpload = () => {
  cy.fileInput("testfile.doc");
  cy.submitButton("Upload documents").click();
  cy.validationNotification("Your document has been uploaded.");
};

export const projCostsFileUpload = () => {
  cy.fileInput("testfile.doc");
  cy.submitButton("Upload documents").click();
  cy.validationNotification("document has been uploaded");
};

export const fcFileUploadedSection = () => {
  cy.get("h2").contains("Files uploaded");
  cy.paragraph("All documents uploaded will be shown here.");
  cy.getByQA("prepare-item-file-for-partner-documents-container").within(() => {
    ["File name", "Type", "Date uploaded", "Size", "Uploaded by"].forEach((header, index) => {
      cy.get(`th:nth-child(${index + 1})`).contains(header);
    });
  });
  ["testfile.doc", "Drawdown approval", uploadDate, "0KB", "Sarah Shuang"].forEach((rowItem, index) => {
    cy.get(`td:nth-child(${index + 1})`).contains(rowItem);
  });
};

export const projCostsSelectFileDescription = () => {
  [
    "Invoice",
    "Independent accountant’s report",
    "Claim evidence",
    "Statement of expenditure",
    "LMC documents",
    "Schedule 3",
  ].forEach(fileDescription => {
    cy.get("select#description.govuk-select").select(fileDescription);
  });
};

export const projCostsUploadedSection = () => {
  cy.get("h2").contains("Files uploaded");
  cy.paragraph("All documents uploaded will be shown here.");
  ["File name", "Type", "Date uploaded", "Size", "Uploaded by"].forEach((header, index) => {
    cy.get("thead")
      .eq(0)
      .within(() => {
        cy.get(`th:nth-child(${index + 1})`).contains(header);
      });
  });
  ["testfile.doc", "Schedule 3", uploadDate, "0KB", "Sarah Shuang", "Remove"].forEach((docTableItem, index) => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get(`td:nth-child(${index + 1})`).contains(docTableItem);
      });
  });
};

export const pmFileUploadedSection = () => {
  cy.get("h2").contains("Files uploaded");
  cy.paragraph("All documents uploaded will be shown here.");
  ["File name", "Type", "Date uploaded", "Size", "Uploaded by", "testfile.doc", "Drawdown approval"].forEach(
    docTableItem => {
      cy.getByQA("loan-documents-viewer-container").contains(docTableItem);
    },
  );
};

export const deleteFile = () => {
  cy.button("Remove").click({ multiple: true });
  cy.validationNotification(`'${testFile}' has been removed.`);
};

export const additionalInfo = () => {
  cy.get("legend").contains("Additional information (Optional)");
  cy.get("#hint-for-comments").contains("If you want to explain anything to Innovate UK, add it here.");
  cy.get("textarea").clear().type(standardComments);
  cy.paragraph("You have 74 characters");
};

export const sendYourRequestSection = () => {
  cy.get("legend").contains("Now send your request");
  cy.paragraph("By submitting this drawdown request I confirm that");
  cy.submitButton("Accept and send");
};

export const loansPcrCheckBoxes = () => {
  /**
   * Check each check box can be selected
   */
  cy.clickCheckBox("Reallocate project costs");
  cy.clickCheckBox("Change project scope");
  cy.clickCheckBox("Put project on hold");
  cy.clickCheckBox("Loan Drawdown Change");
  cy.clickCheckBox("Change Loans Duration");

  /**
   * Check that each check box can be unselected
   */
  cy.clickCheckBox("Reallocate project costs", true);
  cy.clickCheckBox("Change project scope", true);
  cy.clickCheckBox("Put project on hold", true);
  cy.clickCheckBox("Loan Drawdown Change", true);
  cy.clickCheckBox("Change Loans Duration", true);
};

export const loansPcrCheckboxesWithHint = () => {
  [
    "Reallocate project costs",
    "Change project scope",
    "Put project on hold",
    "Loan Drawdown Change",
    "Change Loans Duration",
  ].forEach(pcrType => {
    cy.get(".govuk-label").contains(pcrType);
    cy.get(".govuk-label").contains(pcrType).get(".govuk-hint");
  });
};

export const submitCancelButtons = () => {
  cy.submitButton("Create request");
  cy.get("a").contains("Cancel").click();
};

export const giveUsInfoTodo = () => {
  cy.get("h2").contains("Give us information");
  cy.assertPcrCompletionStatus("Loan Drawdown Change", "To do");
};

export const explainReasoningTodo = () => {
  cy.get("h2").contains("Explain why you want to make the changes");
  cy.assertPcrCompletionStatus("Provide reasoning to Innovate UK", "To do");
};

export const deletePcr = () => {
  visitApp({ path: "projects/a0E2600000kTcmIEAS/pcrs/dashboard" });
  cy.getByQA("pcrDeleteLink").contains("Delete").click();
  cy.get("button").contains("Delete request").click({ force: true });
};

export const loansEditTable = () => {
  let baseCurrentAmount = 10000;
  ["Drawdown", "Current date", "Current amount", "New date", "New amount"].forEach((header, index) => {
    cy.get("tr")
      .eq(0)
      .within(() => {
        cy.get(`th:nth-child(${index + 1})`).contains(header);
      });
  });
  [
    ["1", "1 February 2021", newCurrency.format(baseCurrentAmount), "01", "02", "2021", baseCurrentAmount],
    ["2", "1 August 2021", newCurrency.format(baseCurrentAmount + 1000), "01", "08", "2021", baseCurrentAmount + 1000],
    [
      "3",
      "1 November 2021",
      newCurrency.format(baseCurrentAmount + 3000),
      "01",
      "11",
      "2021",
      baseCurrentAmount + 3000,
    ],
    [
      "4",
      "1 February 2022",
      newCurrency.format(baseCurrentAmount + 4000),
      "01",
      "02",
      "2022",
      baseCurrentAmount + 4000,
    ],
    ["5", "1 May 2022", newCurrency.format(baseCurrentAmount + 5000), "01", "05", "2022", baseCurrentAmount + 5000],
    ["6", "1 August 2022", newCurrency.format(baseCurrentAmount + 6000), "01", "08", "2022", baseCurrentAmount + 6000],
    [
      "7",
      "1 November 2022",
      newCurrency.format(baseCurrentAmount + 7000),
      "01",
      "11",
      "2022",
      baseCurrentAmount + 7000,
    ],
    [
      "8",
      "1 February 2023",
      newCurrency.format(baseCurrentAmount + 8000),
      "01",
      "02",
      "2023",
      baseCurrentAmount + 8000,
    ],
  ].forEach(([drawdown, currentDate, currentAmount, day, month, year, total], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get(`td:nth-child(1)`).contains(drawdown);
        cy.get(`td:nth-child(2)`).contains(currentDate);
        cy.get(`td:nth-child(3)`).contains(currentAmount);
        cy.get(`td:nth-child(4)`).within(() => {
          cy.getByLabel("Day").should("have.value", day);
          cy.getByLabel("Month").should("have.value", month);
          cy.getByLabel("Year").should("have.value", year);
        });
        cy.get(`td:nth-child(5)`).within(() => {
          cy.get("input").should("have.value", total);
        });
      });
  });
  cy.get("tfoot").within(() => {
    cy.get("th:nth-child(1)").contains("Total");
    cy.get("th:nth-child(3)").contains("£114,000.00");
    cy.get("th:nth-child(5)").contains("£114,000.00");
  });
};

export const updateLoansValue = () => {
  for (let i = 1; i < 9; i++) {
    cy.get("tr")
      .eq(i)
      .within(() => {
        cy.get("td:nth-child(5)").within(() => {
          cy.get("input").clear().wait(100).type("1").wait(100);
        });
      });
  }
};

export const amendLoansTable = () => {
  [
    "Drawdown",
    "Current date",
    "Current amount",
    "New date",
    "New amount",
    "Total",
    "£8.00",
    "£114,000.00",
    "Edit",
  ].forEach(editItem => {
    cy.get("table").contains(editItem);
  });
};

export const acceptNegativeInput = () => {
  cy.get("tr > td:nth-child(6)").contains("a", "Edit").click();
  cy.get("tr")
    .eq(1)
    .within(() => {
      cy.get("td:nth-child(5)").within(() => {
        cy.get("input").clear().wait(100).type("-200").wait(200);
      });
    });
  cy.get("tfoot").within(() => {
    cy.get("th:nth-child(5)").contains("-£193.00");
  });
};

export const changeFirstValue = () => {
  cy.get("tr > td:nth-child(6)").contains("a", "Edit").click();
  cy.get("tr")
    .eq(1)
    .within(() => {
      cy.get("td:nth-child(5)").within(() => {
        cy.get("input").clear().wait(100).type("2").wait(200);
      });
    });
  cy.get("tfoot").within(() => {
    cy.get("th:nth-child(5)").contains("£9.00");
  });
  cy.clickOn("Continue to summary");
  cy.get("legend").contains("Mark as complete");
  cy.get("tfoot").within(() => {
    cy.get("tr")
      .eq(0)
      .within(() => {
        cy.get("th:nth-child(5)").contains("£9.00");
      });
  });
};

export const markAndContinue = () => {
  cy.get("legend").contains("Mark as complete");
  cy.getByLabel("I agree with this change.").check();
  cy.submitButton("Save and return to request").click();
};

export const currentLoanTable = () => {
  ["Phase", "Current length (quarters)", "Current end date", "New length (quarters)", "New end date"].forEach(
    (loanChangeHeader, index) => {
      cy.get("thead")
        .eq(0)
        .within(() => {
          cy.get(`th:nth-child(${index + 1})`).contains(loanChangeHeader);
        });
    },
  );
  ["Availability Period", "Extension Period", "Repayment Period"].forEach((phase, index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(phase);
      });
  });
};

export const newLoanDurationTable = () => {
  const quarts = [
    "1 quarter",
    "2 quarters",
    "3 quarters",
    "4 quarters",
    "5 quarters",
    "6 quarters",
    "7 quarters",
    "8 quarters",
    "9 quarters",
    "10 quarters",
    "11 quarters",
    "12 quarters",
    "13 quarters",
    "14 quarters",
    "15 quarters",
    "16 quarters",
    "17 quarters",
    "18 quarters",
    "19 quarters",
    "20 quarters",
    "21 quarters",
    "22 quarters",
    "23 quarters",
    "24 quarters",
    "25 quarters",
  ];

  quarts.forEach(availQuarter => {
    cy.get(`select[name="availabilityPeriodChange"]`).select(availQuarter);
  });
  quarts.forEach(extensionQuarter => {
    cy.get(`select[name="extensionPeriodChange"]`).select(extensionQuarter);
  }),
    quarts.forEach(repaymentQuarter => {
      cy.get(`select[name="repaymentPeriodChange"]`).select(repaymentQuarter);
    });
};

export const updatedLoansTable = () => {
  ["Phase", "Current length (quarters)", "Current end date", "New length (quarters)", "New end date"].forEach(
    (header, index) => {
      cy.get(`th:nth-child(${index + 1})`).contains(header);
    },
  ),
    [
      ["Availability Period", "8", "01/02/2025", "25", "01/05/2029"],
      ["Extension Period", "0", "01/02/2025", "25", "01/08/2035"],
      ["Repayment Period", "0", "01/02/2025", "25", "01/11/2041"],
    ].forEach(([phase, currentLength, currentEnd, newLength, newEnd], index) => {
      cy.get("tr")
        .eq(index + 1)
        .within(() => {
          cy.get("td:nth-child(1)").contains(phase);
          cy.get("td:nth-child(2)").contains(currentLength);
          cy.get("td:nth-child(3)").contains(currentEnd);
          cy.get("td:nth-child(4)").contains(newLength);
          cy.get("td:nth-child(5)").contains(newEnd);
          cy.get("td:nth-child(6)").contains("Edit");
        });
    });
};

export const loanDurationGuidance = () => {
  cy.paragraph("You can request a change to the duration of the phases of your loans project.");
  cy.paragraph("Project start date:");
};

export const markAndReturn = () => {
  cy.getByLabel("I agree with this change").click();
  cy.submitButton("Save and return to request").click();
};

export const assertForMissingPcr = () => {
  cy.get("a").contains("Create request").click();
  cy.clickCheckBox("Change project scope");
  cy.get("button").contains("Create request").click();
  cy.heading("Request");
  cy.get("button").contains("Save and return to requests").click();
  cy.heading("Project change requests");
  cy.get("a").contains("Create request").click();
  cy.get("span").contains("Learn about why some PCR types are missing").click();
  cy.paragraph("Some types are unavailable because they have already been added to another PCR.");
  cy.list("Change project scope");
  cy.get("a").contains("Cancel").click();
};

export const fcAndPmFileAssertion = () => {
  cy.backLink("Back to loans summary page");

  cy.switchUserTo(fcEmail);
  cy.wait(500);
  fileTidyUp("Wednesday Addams");
  drawdownFileUpload();
  cy.switchUserTo(pmEmail);
  cy.wait(500);
  pmFileUploadedSection();
};

export const projCostsDownload = () => {
  cy.readFile("cypress/documents/testfile.doc", "base64").then((base64: string) => {
    cy.get("a")
      .contains("testfile.doc")
      .invoke("attr", "href")
      .then(href => cy.downloadFile(href))
      .should(obj => {
        expect(obj.headers["content-disposition"] ?? "").to.include("testfile.doc");
        expect(obj.redirected).to.eq(false);
        expect(obj.status).to.eq(200);
        expect(obj.ok).to.eq(true);
        expect(obj.base64).to.eq(base64);
      });
  });
};

export const projCostsPeriodTable = () => {
  let thnth = 1;
  [
    "Partner",
    "Forecast costs for period",
    "Actual costs for period",
    "Difference",
    "Status",
    "Date of last update",
  ].forEach(header => {
    cy.get(`th:nth-child(${thnth++})`).contains(header);
  });
  let tdnth = 1;
  ["EUI Small Ent Health (Lead)", "£115,000.00", "£115,000.00", "£0.00", "Draft", uploadDate, "Edit"].forEach(row => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get(`td:nth-child(${tdnth++})`).contains(row);
      });
  });
};

export const projCostsCostHeaders = () => {
  let i = 1;
  [
    "Category",
    "Total eligible costs",
    "Eligible costs to date",
    "Eligible costs this period",
    "Remaining eligible costs",
  ].forEach(header => {
    cy.getByQA("cost-cat").within(() => {
      cy.get("thead").within(() => {
        cy.get(`th:nth-child(${i})`).contains(header);
        i++;
      });
    });
  });
};

export const costCatTable = () => {
  [
    ["Loans costs for Industrial participants", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Overheads", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Materials", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Subcontracting", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["Capital usage", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Travel and subsistence", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Other costs", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Other costs 2", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Other costs 3", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Other costs 4", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Other costs 5", "£11,500.00", "£0.00", "£11,500.00", "£0.00"],
    ["Total", "£115,000.00", "£0.00", "£115,000.00", "£0.00"],
  ].forEach((cols, index) => {
    cy.getByQA("cost-cat").within(() => {
      cy.get("tr")
        .eq(index + 1)
        .within(() => {
          for (let i = 0; i < cols.length; i++) cy.get(`td:nth-child(${i + 1})`).contains(cols[i]);
        });
    });
  });
};

export const projCostsDrawdownTable = () => {
  let i = 1;
  [
    "Current drawdown",
    "Total loan amount",
    "Drawdowns to date",
    "Drawdown this period",
    "Remaining loan amount",
  ].forEach(header => {
    cy.contains("table", "Current drawdown").within(() => {
      cy.get(`th:nth-child(${i})`).contains(header);
      i++;
    });
  });
  let a = 1;
  ["1", "£115,000.00", "£0.00", "£10,000.00", "£105,000.00"].forEach(rowItem => {
    cy.contains("table", "Current drawdown").within(() => {
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get(`td:nth-child(${a})`).contains(rowItem);
          a++;
        });
    });
  });
};

export const projCostsStatusSection = () => {
  cy.button("Status and comments log");
  cy.button("Show").click();
  cy.button("Hide");
  cy.paragraph("There are no changes.");
};

export const loansForecastNavigate = () => {
  cy.selectTile("Project costs");
  cy.heading("Project costs");
  cy.get("a").contains("Edit").click();
  cy.heading("Costs for this period");
  cy.clickOn("Continue to costs documents");
  cy.heading("Supporting evidence");
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
};

export const projCostsForecastTopThreeRows = () => {
  [
    ["Period", "1", "2", "3", "4", "5", "6", "7"],
    ["IAR Due", "Yes", "No", "No", "No", "Yes", "No", "No", "Yes"],
    [
      "Month",
      "Feb to Apr 2023",
      "May to Jul 2023",
      "Aug to Oct 2023",
      "Nov 2023 to Jan 2024",
      "Feb to Apr 2024",
      "May to Jul 2024",
      "Aug to Oct 2024",
      "Nov 2024 to Jan 2025",
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

export const loansForecastLockedCols = () => {
  (
    [
      ["Loans costs for Industrial participants", "£11,500.00"],
      ["Overheads", "£11,500.00"],
      ["Materials", "£11,500.00"],
      ["Subcontracting", "£0.00"],
      ["Capital usage", "£11,500.00"],
      ["Travel and subsistence", "£11,500.00"],
      ["Other costs ", "£11,500.00"],
      ["Other costs 2", "£11,500.00"],
      ["Other costs 3", "£11,500.00"],
      ["Other costs 4", "£11,500.00"],
      ["Other costs 5", "£11,500.00"],
    ] as const
  ).forEach(([costcat, value]) => {
    cy.get("td:nth-child(1)").contains(costcat);
    cy.get("td:nth-child(2)").contains(value);
  });
  cy.get("tr")
    .eq(15)
    .within(() => {
      cy.get("th:nth-child(1)").contains("Total");
      cy.get("td:nth-child(2)").contains("£115,000.00");
    });
};

export const updateLoansProjCostsForecast = () => {
  let totalCell = (rowNum: number, value: string) => {
    cy.get("tr")
      .eq(rowNum)
      .within(() => {
        cy.get("td:nth-child(10)").contains(value);
      });
  };

  for (let inputNum = 2; inputNum < 9; inputNum++) {
    let baseTotal = 11500 + inputNum * 100 - 100;
    let subcontractingTotal = 0 + inputNum * 100 - 100;
    let totalString = baseTotal.toLocaleString("en-UK");
    let subcontractingString = subcontractingTotal.toLocaleString("en-GB");

    [
      [`Loans costs for Industrial participants Period ${inputNum}`, "4", `£${totalString}.00`],
      [`Overheads Period ${inputNum}`, "5", `£${totalString}.00`],
      [`Materials Period ${inputNum}`, "6", `£${totalString}.00`],
      [`Subcontracting Period ${inputNum}`, "7", `£${subcontractingString}.00`],
      [`Capital usage Period ${inputNum}`, "8", `£${totalString}.00`],
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
    "6.09%",
    "6.09%",
    "6.09%",
    "0.00%",
    "6.09%",
    "6.09%",
    "6.09%",
    "6.09%",
    "6.09%",
    "6.09%",
    "6.09%",
  ];
  let percentage = 0;
  for (let i = 4; i < 12; i++) {
    cy.get("tr")
      .eq(i)
      .within(() => {
        cy.get("td:nth-child(12)").contains(percentages[percentage]);
        percentage += 1;
      });
  }
};

export const loansForecastValidation = () => {
  [
    "loans costs for industrial participants",
    "overheads",
    "materials",
    "subcontracting",
    "capital usage",
    "travel and subsistence",
    "other costs",
    "other costs 2",
    "other costs 3",
    "other costs 4",
    "other costs 5",
  ].forEach(warning => {
    cy.get("li").contains(warning);
  });
  cy.getByQA("forecasts-warning-fc-content").contains(
    "The amount you are requesting is more than the agreed costs for:",
  );
  cy.getByQA("forecasts-warning-fc-content").contains(
    "Your Monitoring Officer will let you know if they have any concerns.",
  );
};

export const loansForecastDecimals = () => {
  [100.66, 66.66, 333.33, 21.66, 33.66].forEach(input => {
    cy.getByAriaLabel("Loans costs for Industrial participants Period 2").clear().type(input.toString());
    cy.getByAriaLabel("Loans costs for Industrial participants Period 2").should("have.value", input);
  });
};

export const loansForecastEmptyCell = () => {
  cy.getByAriaLabel("Loans costs for Industrial participants Period 2").clear();
  cy.wait(500);
  cy.button("Continue to summary").click();
  cy.validationLink("Enter forecast.");
};

/**
 * Note that a true copy and paste test doesn't exist for cypress.
 * If testing manually, you would get the result 'Forecast must be a number.'
 * For cypress this is the best we can do to ensure it never sames
 */
export const loansForecastCopyPaste = () => {
  cy.getByAriaLabel("Loans costs for Industrial participants Period 2")
    .clear()
    .invoke("val", "noWordsAllowed")
    .trigger("input");
  cy.wait(200);
  cy.button("Continue to summary").click();
  cy.validationLink("Enter forecast.");
};

export const loansCostsPageNavigate = () => {
  cy.selectTile("Project costs");
  cy.heading("Project costs");
  cy.get("a").contains("Edit").click();
  cy.heading("Costs for this period");
};

export const navigateToSummary = () => {
  cy.get("a").contains("Continue to update forecast").click();
  cy.heading("Update forecast");
  cy.button("Continue to summary").click();
  cy.heading("Costs summary");
};

export const workingBackLink = () => {
  cy.backLink("Back to update forecast").click();
  cy.heading("Update forecast");
  cy.button("Continue to summary").click();
  cy.heading("Costs summary");
};

export const correctCostListforPeriod = () => {
  [
    ["Total costs for period", "£115,000.00"],
    ["Funding level", "65.00%"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
};

export const loansForecastCosts = () => {
  cy.get("h3").contains("Forecast");
  [
    ["Total eligible costs", "£115,000.00"],
    ["Total of forecasts and costs", "£115,000.00"],
    ["Difference", "£0.00 (0.00%)"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
};

export const updateLoansCosts = () => {
  cy.get("a").contains("Loans costs for Industrial participants").click();
  cy.heading("Loans costs for Industrial participants");
  cy.get("#lineItems_0_description").clear().type("Stuff");
  cy.get("#lineItems_0_value").clear().type("11400");
  cy.wait(500);
  cy.button("Save and return to project costs").click();
  cy.heading("Costs for this period");
};

export const navigateCheckForUpdatedValues = () => {
  cy.clickOn("Continue to costs documents");
  cy.heading("Supporting evidence");
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
  cy.clickOn("Continue to summary");
  cy.heading("Costs summary");
  [["Total costs for period", "£114,900.00"]].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
  [
    ["Total of forecasts and costs", "£114,900.00"],
    ["Difference", "£100.00 (0.09%)"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
};

export const supportingEvidence = () => {
  cy.get("h3").contains("Supporting evidence");
  cy.paragraph("You must upload a supporting document before you can submit this claim.");
  cy.get("a").contains("Edit supporting evidence");
};

export const resetCosts = () => {
  cy.get("a").contains("Edit").click();
  cy.heading("Costs for this period");
  cy.get("a").contains("Loans costs for Industrial participants").click();
  cy.heading("Loans costs for Industrial participants");
  cy.get("#lineItems_0_description").clear().type("Stuff");
  cy.get("#lineItems_0_value").clear().type("11500");
  cy.wait(500);
  cy.button("Save and return to project costs").click();
  cy.heading("Costs for this period");
};

export const navigateDocDelete = () => {
  cy.clickOn("Continue to costs documents");
  cy.heading("Supporting evidence");
  cy.button("Remove").click();
  cy.validationNotification("has been removed.");
};

export const createReallocatePartnerPcr = () => {
  cy.getByLabel("Reallocate project costs").check();
  cy.wait(500);
  cy.button("Create request").click();
  cy.heading("Request");
};

export const addRemainingPcrTypes = () => {
  ["Change project scope", "Put project on hold", "Loan Drawdown Change"].forEach(pcrType => {
    cy.getByLabel(pcrType).check();
    cy.wait(500);
    cy.button("Add to request").click();
    cy.heading("Request");
    cy.get("a").contains("Add types").click();
    cy.heading("Add types");
  });
  cy.getByLabel("Change Loans Duration").check();
  cy.wait(500);
  cy.button("Add to request").click();
  cy.heading("Request");
};

export const backOutCreateProjectOnHold = () => {
  cy.backLink("Back to project change requests").click();
  cy.heading("Project change requests");
  cy.getByQA("validation-message-content").contains(
    "A new project change request cannot be created at this time because all available types are already in use. Existing requests must be deleted if still in draft, or concluded by Innovate UK before a new one can be started.",
  );
  [
    "Loan Drawdown Change",
    "Reallocate project costs",
    "Change project scope",
    "Put project on hold",
    "Change Loans Duration",
  ].forEach(pcr => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("td:nth-child(2)").contains(pcr);
      });
  });
  cy.get("main").within(() => {
    cy.get("button").should("not.contain", "Create request");
  });
};

export const learnWhyPCRTypesMissing = () => {
  cy.get("details").should("not.have.attr", "open");
  cy.clickOn("Learn about why some PCR types are missing");
  cy.get("details").should("have.attr", "open");
  cy.paragraph("Some types are unavailable because they have already been added to another PCR.");
  cy.paragraph(
    "The PCR must be deleted if still in draft, or concluded by Innovate UK before a new one can be started.",
  );
  [
    "Change Loans Duration",
    "Change project scope",
    "Loan Drawdown Change",
    "Put project on hold",
    "Reallocate project costs",
  ].forEach(list => {
    cy.list(list);
  });
  cy.clickOn("Learn about why some PCR types are missing");
  cy.get("details").should("not.have.attr", "open");
};

export const submitWithoutDocExceedChar = () => {
  cy.submitButton("Accept and send").click();
  cy.validationLink("The request is only accepted when at least 1 document has been uploaded.");
  cy.paragraph("The request is only accepted when at least 1 document has been uploaded.");
  cy.validationLink("Comments must be between 5 and 32768 characters.");
  cy.paragraph("Comments must be between 5 and 32768 characters.");
};

export const deleteAllCharSubmitWith4 = () => {
  cy.get("textarea").clear().type("test");
  cy.submitButton("Accept and send").click();
  cy.validationLink("The request is only accepted when at least 1 document has been uploaded.");
  cy.paragraph("The request is only accepted when at least 1 document has been uploaded.");
  cy.validationLink("Comments must be between 5 and 32768 characters.");
  cy.paragraph("Comments must be between 5 and 32768 characters.");
};
