import { When } from "@badeball/cypress-cucumber-preprocessor";

When("the user clicks the {string} accordion", function (name: string) {
  cy.getButton(name).click();
});

When("the user clicks the {string} button", function (name: string) {
  cy.getButton(name).click();
});
