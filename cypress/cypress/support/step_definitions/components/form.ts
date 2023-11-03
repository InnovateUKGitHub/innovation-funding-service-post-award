import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When(
  "the user uploads {string} renamed as {string} as type {string}",
  function (path: string, name: string, type: string) {
    cy.setFileFromDisk(path, name);
    cy.getByLabel("Type").select(type);
    cy.getForm().submit({ timeout: Cypress.env("SALESFORCE_TIMEOUT") });
    cy.getSuccessMessage().should("exist");
  },
);

Then("the user cannot see the {string} input", (label: string) => {
  cy.getLabel(label).should("not.exist");
});

Then("the user can see the {string} input", (label: string) => {
  cy.getByLabel(label).should("exist");
});
