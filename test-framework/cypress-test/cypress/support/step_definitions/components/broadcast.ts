import { When } from "@badeball/cypress-cucumber-preprocessor";

When("the user can see the broadcast banner", function () {
  cy.getHeading("Broadcasts").should("exist");
  cy.getParagraph("Cypress broadcast message").should("exist");
  cy.getParagraph("<p>The quick brown fox jumps over the lazy dog</p>").should("exist");
});
