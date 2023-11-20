import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees the projects dashboard", () => {
  cy.waitForPageHeading("Dashboard").should("exist");
});
