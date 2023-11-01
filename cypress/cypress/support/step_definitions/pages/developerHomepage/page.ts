import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("they should see the developer homepage", () => {
  cy.get("h1").should("have.text", "Home");
});
