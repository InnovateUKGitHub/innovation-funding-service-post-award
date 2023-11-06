import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees {int} tile(s)", (int: number) => {
  cy.get(".card-link").should("have.length", int);
});

Then("the user sees the {string} tile", (title: string) => {
  cy.get(".card-link h2").should("contain.text", title);
});

When("the user clicks the {string} tile", (title: string) => {
  cy.get(".card-link h2").contains(title).click();
});
