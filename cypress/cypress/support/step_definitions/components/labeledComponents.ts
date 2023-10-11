import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("the user sees the {string} area", function (title: string) {
  cy.getByLabel(title);
});

When("the user searches for {string}", function (searchCrit: string) {
  cy.getByLabel("Search").clear().type(searchCrit);
});

When("the user clicks the {string} checkbox", function (title: string) {
  cy.getByLabel(title).click();
});

Then("the user sees the filtered {string} listed on the project cards", function (result: string) {
  cy.get(".govuk-grid-row").contains(result);
});
