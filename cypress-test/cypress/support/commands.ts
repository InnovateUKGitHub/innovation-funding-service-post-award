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

Cypress.Commands.add("getByLabel", getByLabel);
Cypress.Commands.add("getByQA", getByQA);
Cypress.Commands.add("getByAriaLabel", getByAriaLabel);
Cypress.Commands.add("switchUserTo", switchUserTo);
Cypress.Commands.add("resetUser", resetUser);
Cypress.Commands.add("backLink", backLink);
Cypress.Commands.add("submitButton", submitButton);
