export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click();
};

export const selectFileDescription = () => {
  cy.get("select#description.govuk-select").select("130");
  cy.get("select#description.govuk-select").select("140");
  cy.get("select#description.govuk-select").select("150");
  cy.get("select#description.govuk-select").select("160");
  cy.get("select#description.govuk-select").select("170");
  cy.get("select#description.govuk-select").select("180");
  cy.get("select#description.govuk-select").select("190");
  cy.get("select#description.govuk-select").select("200");
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
  cy.uploadButton;
  cy.wait(4000);
};

export const displayMOFile = () => {
  cy.get("h3").contains("Documents shared with Innovate UK and Monitoring Officer");
  cy.get("td.govuk-table__cell").contains("testfile.doc");
};

export const deleteDocFromArea = () => {
  cy.getByQA("button_delete-qa").contains("Remove").click();
  cy.wait(4000);
};

export const uploadToEUI = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and EUI Small Ent Health");
  cy.get("select#description.govuk-select").select("130");
  cy.uploadButton;
  cy.wait(4000);
};

export const displayEUIFile = () => {
  cy.get("h3").contains("Documents shared with Innovate UK and partners");
  cy.get("td.govuk-table__cell").contains("testfile.doc");
};

export const uploadToAB = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and A B Cad Services");
  cy.get("select#description.govuk-select").select("130");
  cy.uploadButton;
  cy.wait(4000);
};

export const displayABFile = () => {
  cy.get("h3").contains("Innovate UK and partners");
  cy.get("td.govuk-table__cell").contains("testfile.doc");
};

export const uploadToEUIMed = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and ABS EUI Medium Enterprise");
  cy.get("select#description.govuk-select").select("130");
  cy.uploadButton;
  cy.wait(4000);
};

export const displayEUIMedFile = () => {
  cy.get("h3").contains("Innovate UK and partners");
  cy.get("td.govuk-table__cell").contains("testfile.doc");
};
