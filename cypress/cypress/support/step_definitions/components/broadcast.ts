import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("the user can see the broadcast banner", function () {
  cy.getHeading("Broadcasts").should("exist");
  cy.getParagraph("Cypress broadcast message").should("exist");
  cy.getParagraph("This is a test message for Cypress").should("exist");
});
