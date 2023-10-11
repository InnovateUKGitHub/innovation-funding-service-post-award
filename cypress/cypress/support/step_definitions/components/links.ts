import { When } from "@badeball/cypress-cucumber-preprocessor";

When("the user clicks the {string} link", function (title: string) {
  cy.get("a").contains(title).click();
});

When("the user clicks the {string} backlink", function (title: string) {
  cy.getBackLink(title).click();
});
