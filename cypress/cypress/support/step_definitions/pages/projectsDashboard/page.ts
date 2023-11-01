import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("they should see the projects dashboard", () => {
  cy.get("h1").should("have.text", "Dashboard");
});
