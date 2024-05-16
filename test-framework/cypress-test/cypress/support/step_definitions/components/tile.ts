import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees {int} tile(s)", (int: number) => {
  cy.getTile().should("have.length", int);
});

Then("the user sees the {string} tile", (title: string) => {
  cy.getTile({ label: title }).should("contain.text", title);
});

When("the user clicks the {string} tile", (title: string) => {
  cy.getTile({ label: title }).click();
});
