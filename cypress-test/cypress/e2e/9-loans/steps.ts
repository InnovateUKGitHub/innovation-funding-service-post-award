export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

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
