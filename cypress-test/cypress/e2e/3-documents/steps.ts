export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click();
};

export const selectFileDescription = () => {
  ["130", "140", "150", "160", "170", "180", "190", "200"].forEach(fileDescription => {
    cy.get("select#description.govuk-select").select(fileDescription);
  });
};

export const accessControl = () => {
  cy.get("select#partnerId.govuk-select").select("Innovate UK and MO only");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and EUI Small Ent Health");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and A B Cad Services");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and ABS EUI Medium Enterprise");
};

export const learnAboutFiles = () => {
  cy.get("span.govuk-details__summary-text").contains("Learn more about files you can upload").click();
  cy.get("span.govuk-body.markdown").contains("You can upload");
};

export const uploadToMO = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK and MO only");
  cy.get("select#description.govuk-select").select("130");
  cy.submitButton("Upload documents").click();
};

export const displayMOFile = () => {
  cy.get("h3").contains("Documents shared with Innovate UK and Monitoring Officer");
  cy.tableCell("testfile.doc");
};

export const deleteDocFromArea = () => {
  cy.getByQA("button_delete-qa").contains("Remove").click();
  cy.getByQA("validation-message-content").contains("has been deleted.");
};

export const uploadToEUI = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and EUI Small Ent Health");
  cy.get("select#description.govuk-select").select("130");
  cy.submitButton("Upload documents").click();
};

export const displayEUIFile = () => {
  cy.get("h3").contains("Documents shared with Innovate UK and partners");
  cy.tableCell("testfile.doc");
};

export const uploadToAB = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and A B Cad Services");
  cy.get("select#description.govuk-select").select("130");
  cy.submitButton("Upload documents").click();
};

export const displayABFile = () => {
  cy.get("h3").contains("Innovate UK and partners");
  cy.tableCell("testfile.doc");
};

export const uploadToEUIMed = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and ABS EUI Medium Enterprise");
  cy.get("select#description.govuk-select").select("130");
  cy.submitButton("Upload documents").click();
};

export const displayEUIMedFile = () => {
  cy.get("h3").contains("Innovate UK and partners");
  cy.tableCell("testfile.doc");
};
