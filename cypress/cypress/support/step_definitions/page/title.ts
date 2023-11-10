import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { And } from "@badeball/cypress-cucumber-preprocessor";

Then("the page header is {string}", function (title: string) {
  cy.get("h1").should("have.text", title);
});

And("the user can see the {string} subheading", function (title: string) {
  cy.getHeading("h2").contains(title);
});
