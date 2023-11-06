import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees the developer homepage", () => {
  cy.waitForPageHeading("Home").should("exist");
});
