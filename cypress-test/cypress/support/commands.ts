import "@testing-library/cypress/add-commands";

const getByLabel = (label: string) => {
  cy.log("**getByLabel**");
  cy.contains("label", label, { timeout: 10000 })
    .invoke("attr", "for")
    .then(id => {
      cy.get("#" + id, { timeout: 10000 });
    });
};

const getByQA = (tag: string) => {
  cy.log("**getByQA**");
  cy.get(`[data-qa="${tag}"]`, { timeout: 10000 });
};

const getByPageQA = (tag: string) => {
  cy.log("**getByQA**");
  cy.get(`[data-page-qa="${tag}"]`, { timeout: 10000 });
};

const getByAriaLabel = (label: string) => {
  cy.log("**getByAriaLabel**");
  cy.get(`[aria-label="${label}"]`, { timeout: 10000 });
};

const switchUserTo = (email: string, goHome: boolean = false) => {
  cy.contains("User Switcher").click();
  cy.get("input#user-switcher-manual-input").scrollIntoView().clear().wait(1000).type(email);
  cy.getByQA(`manual-change-and-${goHome ? "home" : "stay"}`).click({ force: true });
  cy.wait(1000);
};

const resetUser = (goHome: boolean = false) => {
  cy.log("**resetUser**");
  cy.contains("User Switcher").click().wait(1000);
  cy.getByQA(`reset-and-${goHome ? "home" : "stay"}`)
    .scrollIntoView()
    .wait(1000)
    .click()
    .wait(1000);
};

const backLink = (name: string) => {
  cy.log("**backLink**");
  cy.get("a.govuk-back-link", { timeout: 10000 }).contains(name, { timeout: 10000 });
};

const submitButton = (name: string) => {
  cy.get('button[type="submit"]', { timeout: 1000 }).contains(name);
};

/**
 * Note that this upload button is different to the one contained within Claims documents upload which is button_upload-qa
 */
const uploadButton = (name: string) => {
  cy.get('button[type="submit"]', { timeout: 10000 }).contains(name);
};

const tableCell = (name: string) => {
  cy.get("td").contains(name, { timeout: 10000 });
};

const tableHeader = (name: string) => {
  cy.get("th").contains(name);
};

const assertPcrCompletionStatus = (pcrType: string, status: string) => {
  cy.log("**assertPcrCompletionStatus**");
  cy.get("li").contains(pcrType).get("strong").contains(status);
};

const clickCheckBox = (label: string, uncheck?: boolean) => {
  cy.log("**clickCheckBox**");
  if (uncheck) {
    cy.getByLabel(label).scrollIntoView().uncheck({ timeout: 5000 });
  } else {
    cy.getByLabel(label).scrollIntoView().check({ force: true, timeout: 5000 });
  }
};

Cypress.Commands.add("getByLabel", getByLabel);
Cypress.Commands.add("getByQA", getByQA);
Cypress.Commands.add("getByPageQA", getByPageQA);
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
