import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the page header is {string}", function (title: string) {
  cy.get("h1").should("have.text", title);
});
