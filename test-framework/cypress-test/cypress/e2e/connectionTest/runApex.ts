import { When } from "@badeball/cypress-cucumber-preprocessor";

When("Cypress tries to run Hello World Apex", function () {
  cy.accTask("runApex", { apex: "System.debug('Hello World\\nHello bye!');" });
});
