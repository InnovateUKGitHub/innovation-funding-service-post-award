import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees {int} tile(s)", (int: number) => {
  cy.getTile().should("have.length", int);
});

Then("the user sees the {string} tile", (title: string) => {
  cy.getTile(title).should("contain.text", title);
});

Then("the user does not see the {string} tile", (title: string) => {
  cy.getTile(title).should("not.exist");
});

When("the user clicks the {string} tile", (title: string) => {
  cy.getTile(title).click();
});
