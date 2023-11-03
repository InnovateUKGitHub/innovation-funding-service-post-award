import { When } from "@badeball/cypress-cucumber-preprocessor";

When("I select the {string} details dropdown", (label: string) => {
  cy.clickOnDetails(label);
});
