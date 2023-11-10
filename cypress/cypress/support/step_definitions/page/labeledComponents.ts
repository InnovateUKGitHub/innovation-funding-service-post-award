import { And, Then } from "@badeball/cypress-cucumber-preprocessor";
import { When } from "@badeball/cypress-cucumber-preprocessor";

And("the user can see the {string} area", function (title: string) {
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
