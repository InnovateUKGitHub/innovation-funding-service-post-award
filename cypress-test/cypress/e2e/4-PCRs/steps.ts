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
  visitApp("projects/a0E2600000kSotUEAS/pcrs/dashboard");
  cy.getByQA("pcrDeleteLink").contains("Delete").click();
  cy.getByQA("button_delete-qa").click();
};
