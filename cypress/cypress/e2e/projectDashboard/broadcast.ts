import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees the broadcast information", () => {
  cy.getByQA("broadcast-start-date")
    .contains(".govuk-grid-row", "Start date:")
    .contains("30 March 2023")
    .should("exist");
});
