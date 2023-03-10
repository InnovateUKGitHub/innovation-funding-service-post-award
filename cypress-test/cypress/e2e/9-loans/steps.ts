export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";
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
    "You can upload up to 10 documents",
    "There is no limit",
    "be less than 32MB",
    "have a unique file name",
    "You can upload these file types",
    "PDF",
    "(pdf,xps)",
    "(doc,docx,rtf,txt,csv,odt)",
    "text",
    "presentation",
    "(ppt,pptx,odp)",
    "spreadsheet",
    "(xls,xlsx,ods)",
    "images",
    "(jpg,jpeg,png,odg)",
  ].forEach(fileInfo => {
    cy.getByQA("loanDocumentsForm").contains(fileInfo);
  });

  cy.get("p").contains("You can upload up to 10 documents");
  cy.get("p").contains("There is no limit");
};

export const drawdownCard = () => {
  cy.get("a").contains("Drawdowns").click();
  cy.get("h1").contains("Drawdowns");
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
  cy.get("h1").contains("Drawdown");
};

export const drawdownGuidance = () => {
  cy.get("p").contains("You can request your drawdown here.");
  cy.get("a").contains("Change drawdown");
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
  cy.get("p").contains("You must upload a signed drawdown approval request");
};

export const drawdownFileUpload = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.submitButton("Upload documents").click();
  cy.getByQA("validation-message-content").contains("file has been uploaded");
};

export const fileUploadedSection = () => {
  cy.get("h2").contains("Files uploaded");
  cy.get("p").contains("All documents uploaded will be shown here.");
  ["File name", "Type", "Date uploaded", "Size", "Uploaded by", "Remove", "testfile.doc", "Drawdown approval"].forEach(
    docTableItem => {
      cy.getByQA("loan-documents-container").contains(docTableItem);
    },
  );
};

export const deleteFile = () => {
  cy.getByQA("button_delete-qa").contains("Remove").click({ multiple: true });
  cy.getByQA("validation-message").contains("has been removed.");
};

export const additionalInfo = () => {
  cy.get("h2").contains("Additional information (Optional)");
  cy.get("p").contains("If you want to explain anything to Innovate UK, add it here.");
  cy.getByQA("info-text-area").clear().type(standardComments);
  cy.getByQA("field-comments").contains("You have 74 characters");
};

export const sendYourRequestSection = () => {
  cy.get("h2").contains("Now send your request");
  cy.get("p").contains("By submitting this drawdown request I confirm that");
  cy.submitButton("Accept and send");
};

export const loansPcrTypes = () => {
  cy.get("span").contains("Learn more about request types").click();
  [
    "Reallocate project costs",
    "Change project scope",
    "Put a project on hold",
    "Change loan drawdown",
    "Change loans duration",
  ].forEach(pcrType => {
    cy.getByQA("form-guidance-list").contains(pcrType);
  });
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

export const loansPcrGuidance = () => {
  cy.get("p").contains("Before you submit, you must:");
  cy.get("li").contains("discuss this request with your monitoring officer");
  cy.get("h2").contains("Select request types");
  cy.get("p").contains("You can select more than one type of request.");
};

export const submitCancelButtons = () => {
  cy.submitButton("Create request");
  cy.get("a").contains("Cancel");
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
  cy.getByQA("button_delete-qa").click({ force: true });
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
  [
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
  ].forEach(availQuarter => {
    cy.get(`select[name="availabilityPeriodChange"]`).select(availQuarter);
  }),
    [
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
    ].forEach(extensionQuarter => {
      cy.get(`select[name="extensionPeriodChange"]`).select(extensionQuarter);
    }),
    [
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
    ].forEach(repaymentQuarter => {
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
  cy.get("p").contains("You can request a change to the duration of the phases of your loans project.");
  cy.get("p").contains("Project start date:");
};

export const markAndReturn = () => {
  cy.getByLabel("I agree with this change").click();
  cy.submitButton("Save and return to request").click();
};
