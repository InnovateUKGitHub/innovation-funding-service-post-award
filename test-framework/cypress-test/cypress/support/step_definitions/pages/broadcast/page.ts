import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees the broadcast page", () => {
  cy.waitForPageHeading("Cypress broadcast message").should("exist");
  cy.getCaption("Broadcast").should("exist");
  cy.getHeading("Details").should("exist");
  cy.getHeading("Message").should("exist");
});
