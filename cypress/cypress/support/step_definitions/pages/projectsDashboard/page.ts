import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I should see the projects dashboard", () => {
  cy.get("h1").should("have.text", "Dashboard");
});
