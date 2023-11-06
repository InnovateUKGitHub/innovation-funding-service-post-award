import { When } from "@badeball/cypress-cucumber-preprocessor";

When("the user opens the {string} dropdown", (label: string) => {
  cy.clickOnDetails(label);
});
