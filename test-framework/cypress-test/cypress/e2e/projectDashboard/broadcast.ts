import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees the broadcast information", () => {
  cy.getByQA("broadcast-start-date")
    .contains(".govuk-grid-row", "Start date:")
    .contains("1 November 1923")
    .should("exist");
  cy.getByQA("broadcast-end-date")
    .contains(".govuk-grid-row", "End date:")
    .contains("31 December 2123")
    .should("exist");
  cy.getParagraph("<p>The quick brown fox jumps over the lazy dog</p>").should("exist");
});
