import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

Then("they should see {int} tile(s)", (int: number) => {
  cy.get(".card-link").should("have.length", int);
});

Then("they should see the {string} tile", (title: string) => {
  cy.get(".card-link h2").should("contain.text", title);
});

When("they select the {string} tile", (title: string) => {
  cy.get(".card-link h2").contains(title).click();
});
