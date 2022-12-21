import "@testing-library/cypress/add-commands";

const getByLabel = (label: string) => {
  cy.log("**getByLabel**");
  cy.contains("label", label)
    .invoke("attr", "for")
    .then(id => {
      cy.get("#" + id);
    });
};

const getByQA = (tag: string) => {
  cy.log("**getByQA**");
  cy.get(`[data-qa="${tag}"]`);
};

const getByAriaLabel = (label: string) => {
  cy.log("**getByAriaLabel**");
  cy.get(`[aria-label="${label}"`);
};

const switchUserTo = (email: string, goHome: boolean = false) => {
  cy.contains("User Switcher").click();
  cy.get("input#user-switcher-manual-input").scrollIntoView().clear().type(email);
  cy.getByQA(`manual-change-and-${goHome ? "home" : "stay"}`).click();
};

const resetUser = (goHome: boolean = false) => {
  cy.getByQA(`reset-and-${goHome ? "home" : "stay"}`).click();
};

const backLink = () => {
  cy.get("a.govuk-back-link");
};

const submitButton = (name: string) => {
  cy.get('button[type="submit"]').contains(name);
};

/**
 * Note that this upload button is different to the one contained within Claims documents upload which is button_upload-qa
 */
const uploadButton = (name: string) => {
  cy.get('button[type="submit"]').contains(name);
};

const tableCell = (name: string) => {
  cy.get("td.govuk-table__cell").contains(name);
};

const tableHeader = (name: string) => {
  cy.get("th.govuk-table__header").contains(name);
};

const assertPcrCompletionStatus = (pcrType: string, status: string) => {
  cy.log("**assertPcrCompletionStatus**");
  cy.get("li").contains(pcrType).get("strong").contains(status);
};

const clickCheckBox = (label: string, uncheck?: boolean) => {
  cy.log("**clickCheckBox**");
  if (uncheck) {
    cy.getByLabel(label).scrollIntoView().wait(500).uncheck();
  } else {
    cy.getByLabel(label).scrollIntoView().wait(500).check();
  }
};

Cypress.Commands.add("getByLabel", getByLabel);
Cypress.Commands.add("getByQA", getByQA);
Cypress.Commands.add("getByAriaLabel", getByAriaLabel);
Cypress.Commands.add("switchUserTo", switchUserTo);
Cypress.Commands.add("resetUser", resetUser);
Cypress.Commands.add("backLink", backLink);
Cypress.Commands.add("submitButton", submitButton);
Cypress.Commands.add("uploadButton", uploadButton);
Cypress.Commands.add("tableCell", tableCell);
Cypress.Commands.add("tableHeader", tableHeader);
Cypress.Commands.add("assertPcrCompletionStatus", assertPcrCompletionStatus);
Cypress.Commands.add("clickCheckBox", clickCheckBox);
