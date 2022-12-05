export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

export const backToProject = () => {
  cy.get("a.govuk-back-link").contains("Back to project");
};

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

/**
 * Can probably use .dbl.click for this function to click and unclick but it's much prettier on the page when performed this way
 */
export const pcrCheckBoxes = () => {
  cy.get("input#types_60.govuk-checkboxes__input").click();
  cy.get("input#types_30.govuk-checkboxes__input").click();
  cy.get("input#types_20.govuk-checkboxes__input").click();
  cy.get("input#types_80.govuk-checkboxes__input").click();
  cy.get("input#types_90.govuk-checkboxes__input").click();
  cy.get("input#types_10.govuk-checkboxes__input").click();
  cy.get("input#types_40.govuk-checkboxes__input").click();
  cy.get("input#types_60.govuk-checkboxes__input").click();
  cy.get("input#types_30.govuk-checkboxes__input").click();
  cy.get("input#types_20.govuk-checkboxes__input").click();
  cy.get("input#types_80.govuk-checkboxes__input").click();
  cy.get("input#types_90.govuk-checkboxes__input").click();
  cy.get("input#types_10.govuk-checkboxes__input").click();
  cy.get("input#types_40.govuk-checkboxes__input").click();
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

export const backToPCRs = () => {
  cy.get("a.govuk-back-link").contains("Back to project change requests");
};
