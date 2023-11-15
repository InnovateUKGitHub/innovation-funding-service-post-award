import { And } from "@badeball/cypress-cucumber-preprocessor";

And("the user can see the broadcast banner", function () {
  cy.getParagraph("Cypress broadcast message");
  cy.getParagraph("This is a test message for Cypress");
});
