import { visitApp } from "../../common/visit";

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click();
};

export const createRequestButton = () => {
  cy.get("a.govuk-link.govuk-button").click();
};

export const explainPCRTypes = () => {
  cy.getByQA("form-guidance-list").contains("Reallocate project costs");
  cy.getByQA("form-guidance-list").contains("Remove a partner");
  cy.getByQA("form-guidance-list").contains("Add a partner");
  cy.getByQA("form-guidance-list").contains("Change project scope");
  cy.getByQA("form-guidance-list").contains("Change project duration");
  cy.getByQA("form-guidance-list").contains("Change partner's name");
  cy.getByQA("form-guidance-list").contains("Put a project on hold");
};

export const pcrCheckBoxes = () => {
  /**
   * Check each check box can be selected
   */
  cy.clickCheckBox("Reallocate project costs");
  cy.clickCheckBox("Remove a partner");
  cy.clickCheckBox("Add a partner");
  cy.clickCheckBox("Change project scope");
  cy.clickCheckBox("Change project duration");
  cy.clickCheckBox("Change a partner's name");
  cy.clickCheckBox("Put project on hold");
  /**
   * Check that each check box can be unselected
   */
  cy.clickCheckBox("Reallocate project costs", true);
  cy.clickCheckBox("Remove a partner", true);
  cy.clickCheckBox("Add a partner", true);
  cy.clickCheckBox("Change project scope", true);
  cy.clickCheckBox("Change project duration", true);
  cy.clickCheckBox("Change a partner's name", true);
  cy.clickCheckBox("Put project on hold", true);
};

export const beforeYouSubmit = () => {
  cy.get("p.govuk-body").contains("Before you submit");
  cy.get("li").contains("ensure");
  cy.get("li").contains("discuss");
};

export const pcrCommentBox = () => {
  cy.get("h2").contains("Add comments");
  cy.get("textarea#comments.govuk-textarea").type(standardComments);
};

export const characterCount = () => {
  cy.get("p.character-count.character-count--default.govuk-body").contains("You have 926 characters remaining");
};

export const deletePcr = () => {
  visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
  cy.getByQA("pcrDeleteLink").contains("Delete", { timeout: 10000 }).click();
  cy.getByQA("button_delete-qa").click();
};

export const learnFiles = () => {
  cy.get("span").contains("Learn more about files you can upload").click();
  cy.get("p").contains("You can upload");
  cy.get("p").contains("There is no limit");
};

export const pcrDocUpload = () => {
  cy.get("input#attachment", { timeout: 10000 }).selectFile("cypress/common/testfile.doc", { timeout: 5000 });
  cy.uploadButton("Upload documents").click();
};

export const pcrFileTable = () => {
  cy.tableHeader("File name");
  cy.tableHeader("Type");
  cy.tableHeader("Date uploaded");
  cy.tableHeader("Uploaded by");
};

export const learnOrganisations = () => {
  cy.get("span").contains("What are the different types?").click();
  cy.get("p").contains("Business");
  cy.get("p").contains("Research");
  cy.get("p").contains("Research and technology organisation (RTO)");
  cy.get("p").contains("Public sector, charity or non Je-S");
};

export const completeNewPartnerInfoAsBus = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
};

export const completeNewPartnerInfoAsResearch = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Research").click();
  cy.submitButton("Save and continue").click();
};

export const completeNewPartnerInfoAsRto = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Research and Technology Organisation (RTO)").click();
  cy.submitButton("Save and continue").click();
};

export const completeNewPartnerInfoAsPublic = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Public Sector, charity or non Je-S registered research organisation").click();
  cy.submitButton("Save and continue").click();
};

export const completeNewPartnerInfoNonAid = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("No").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
};
