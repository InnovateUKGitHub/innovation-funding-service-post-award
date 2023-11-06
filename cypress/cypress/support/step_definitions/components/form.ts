import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

const uploadFile = (path: string) =>
  function (name: string, type?: string) {
    cy.setFileFromDisk(path, name);
    cy.getByLabel("Type").select(type ?? "");
    cy.getForm().submit({ timeout: Cypress.env("SALESFORCE_TIMEOUT") });
    cy.getSuccessMessage().should("exist");
  };

When("the user uploads a small file named {string} with no type", uploadFile("README.md"));
When("the user uploads a small file named {string} as type {string}", uploadFile("README.md"));

Then("the user cannot see the {string} input", (label: string) => {
  cy.getLabel(label).should("not.exist");
});

Then("the user can see the {string} input", (label: string) => {
  cy.getByLabel(label).should("exist");
});
