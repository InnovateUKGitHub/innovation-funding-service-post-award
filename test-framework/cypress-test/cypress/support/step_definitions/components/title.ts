import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

Then("the page header is {string}", function (title: string) {
  cy.get("h1").should("have.text", title);
});

Then("the page caption is {string}", function (caption: string) {
  cy.getCaption(caption).should("exist");
});

Then("the user sees the {string} page title", function (title: string) {
  cy.waitForPageHeading(title).should("exist");
});

When("the user sees the {string} subheading", function (heading: string) {
  cy.getHeading(heading).should("exist");
});
