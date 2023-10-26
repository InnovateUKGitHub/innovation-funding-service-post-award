const pmEmail = "james.black@euimeabs.test";
const fcEmail = "wed.addams@test.test.co.uk";
const hybridEmail = "s.shuang@irc.trde.org.uk.test";

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";
import { fileTidyUp } from "common/filetidyup";
import { testFile } from "common/testfileNames";
import { visitApp } from "common/visit";

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

export const learnFiles = () => {
  cy.get("span").contains("Learn more about files you can upload").click();
  [
    "You can upload up to 10 documents at a time. Each document must:",
    "There is no limit to the number of files you can upload in total.",
    "You can upload these file types:",
  ].forEach(para => {
    cy.paragraph(para);
  });
  [
    "be less than 32MB",
    "have a unique file name",
    "PDF",
    "(pdf, xps)",
    "(doc, docx, rtf, txt, csv, odt)",
    "text",
    "presentation",
    "(ppt, pptx, odp)",
    "spreadsheet",
    "(xls, xlsx, ods)",
    "images",
    "(jpg, jpeg, png, odg)",
  ].forEach(fileInfo => {
    cy.get("li").contains(fileInfo);
  });
};

export const drawdownCard = () => {
  cy.get("a").contains("Drawdowns").click();
  cy.heading("Drawdowns");
};

export const drawdownTable = () => {
  [
    "Drawdown",
    "Due date",
    "Drawdown Amount",
    "Status",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "£10,000",
    "£11,000",
    "£13,000",
    "£14,000",
    "£15,000",
    "£16,000",
    "£17,000",
    "£18,000",
    "Planned",
  ].forEach(loanCat => {
    cy.getByQA("drawdown-list").contains(loanCat);
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

export const drawdownRequestTable = () => {
  [
    "Drawdown",
    "Due date",
    "Drawdown forecast",
    "Total loan",
    "Drawdown to date",
    "Drawdown amount",
    "Remaining loan",
    "1",
    "£10,000",
    "-£10,000",
  ].forEach(requestCat => {
    cy.getByQA("drawdown-request").contains(requestCat);
  });
};

export const uploadApprovalGuidance = () => {
  cy.get("h2").contains("Upload drawdown approval request");
  cy.paragraph("You must upload a signed drawdown approval request");
};

export const drawdownFileUpload = () => {
  cy.fileInput("testfile.doc");
  cy.submitButton("Upload documents").click();
  cy.validationNotification("file has been uploaded");
};

export const projCostsFileUpload = () => {
  cy.fileInput("testfile.doc");
  cy.submitButton("Upload documents").click();
  cy.validationNotification("document has been uploaded");
};

export const fcFileUploadedSection = () => {
  cy.get("h2").contains("Files uploaded");
  cy.paragraph("All documents uploaded will be shown here.");
  ["File name", "Type", "Date uploaded", "Size", "Uploaded by", "Remove", "testfile.doc", "Drawdown approval"].forEach(
    docTableItem => {
      cy.getByQA("loan-documents-editor-container").contains(docTableItem);
    },
  );
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
  let i = 1;
  ["File name", "Type", "Date uploaded", "Size", "Uploaded by"].forEach(header => {
    cy.get("thead").within(() => {
      cy.get(`th:nth-child(${i})`).contains(header);
      i++;
    });
  });
  let a = 1;
  ["testfile.doc", "Schedule 3", "2023", "0KB", "Sarah Shuang", "Remove"].forEach(docTableItem => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get(`td:nth-child(${a})`).contains(docTableItem);
        a++;
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
  cy.get("h2").contains("Additional information (Optional)");
  cy.paragraph("If you want to explain anything to Innovate UK, add it here.");
  cy.getByQA("info-text-area").clear().type(standardComments);
  cy.getByQA("field-comments").contains("You have 74 characters");
};

export const sendYourRequestSection = () => {
  cy.get("h2").contains("Now send your request");
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
  [
    "Drawdown",
    "Current date",
    "Current amount",
    "New date",
    "New amount",
    "Total",
    "Day",
    "Month",
    "Year",
    "£114,000.00",
    "£10,000.00",
    "£11,000.00",
    "£13,000.00",
    "£14,000.00",
    "£15,000.00",
    "£16,000.00",
    "£17,000.00",
    "£18,000.00",
  ].forEach(loanItem => {
    cy.getByQA("loan-edit-table").contains(loanItem);
  });
};

export const updateLoansValue = () => {
  [
    "input#1_newValue",
    "input#2_newValue",
    "input#3_newValue",
    "input#4_newValue",
    "input#5_newValue",
    "input#6_newValue",
    "input#7_newValue",
    "input#8_newValue",
  ].forEach(inputItem => {
    cy.get(inputItem).clear().wait(100).type("1").wait(100);
  });
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
    cy.getByQA("loan-edit-table").contains(editItem);
  });
};

export const changeFirstValue = () => {
  cy.get("tr > td:nth-child(6)").contains("a", "Edit").click();
  cy.get("input#1_newValue").clear().wait(100).type("2").wait(200);
  cy.get("td").contains("£9.00");
};

export const markAndContinue = () => {
  cy.get("h2").contains("Mark as complete");
  cy.getByLabel("I agree with this change.").check();
  cy.submitButton("Save and return to request").click();
};

export const currentLoanTable = () => {
  [
    "Phase",
    "Current length (quarters)",
    "Current end date",
    "New length (quarters)",
    "New end date",
    "Availability Period",
    "Extension Period",
    "Repayment Period",
  ].forEach(loanChange => {
    cy.getByQA("loanChangeDuration").contains(loanChange);
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
  [
    "Phase",
    "Current length (quarters)",
    "Current end date",
    "New length (quarters)",
    "New end date",
    "Availability Period",
    "Extension Period",
    "Repayment Period",
    "Edit",
  ].forEach(updatedChange => {
    cy.getByQA("loanChangeDuration").contains(updatedChange);
  });
  cy.get("td:nth-child(4)").contains("25");
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
  cy.switchUserTo(fcEmail);
  cy.wait(500);
  fileTidyUp("Wednesday Addams");
  drawdownFileUpload();
  cy.switchUserTo(pmEmail);
  cy.wait(500);
  pmFileUploadedSection();
};

export const hybridButtonAssertion = () => {
  cy.switchUserTo(hybridEmail);
  cy.backLink("Back to loans summary page").click();
  cy.get("a")
    .contains(/^Request$/)
    .click();
  cy.heading("Drawdown");
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
  ["EUI Small Ent Health (Lead)", "£115,000.00", "£115,000.00", "£0.00", "Draft", "2023", "Edit"].forEach(row => {
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
    cy.getByQA("period-loan-table").within(() => {
      cy.get("thead").within(() => {
        cy.get(`th:nth-child(${i})`).contains(header);
        i++;
      });
    });
  });
  let a = 1;
  ["1", "£115,000.00", "£0.00", "£10,000.00", "£105,000.00"].forEach(rowItem => {
    cy.getByQA("period-loan-table").within(() => {
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
  cy.selectTile("Project Costs");
  cy.heading("Project costs");
  cy.get("a").contains("Edit").click();
  cy.heading("Costs for this period");
  cy.button("Continue to costs documents").click();
  cy.heading("Supporting evidence");
  cy.get("a").contains("Continue to update forecast").click();
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
  cy.validationLink("Forecast is required.");
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
  cy.validationLink("Forecast is required.");
};
