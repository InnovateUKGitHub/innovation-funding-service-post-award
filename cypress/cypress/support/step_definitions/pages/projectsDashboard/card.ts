import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("they should see the {int}", function (projectNumber: number) {
  cy.get(".acc-list-item").contains(projectNumber);
});
