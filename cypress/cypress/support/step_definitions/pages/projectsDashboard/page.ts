import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { And } from "@badeball/cypress-cucumber-preprocessor";
import { When } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees the projects dashboard", () => {
  cy.waitForPageHeading("Dashboard").should("exist");
});

Then("the user sees the {string} page caption", function (title: string) {
  cy.getCaption(title);
});

And("the user sees the {string} page caption", function (title: string) {
  cy.getCaption(title);
});

Then("the user sees the broadcast {string}", function (title: string) {
  cy.getHeading(title);
});

And("the user sees the broadcast {string}", function (title: string) {
  cy.getParagraph(title);
});

And("the user can see the broadcast banner", function () {
  cy.getParagraph("Cypress broadcast message");
  cy.getParagraph("This is a test message for Cypress");
});

And("the user can see search guidance", function () {
  cy.getByLabel("Search").contains("Project number, project or lead partner");
});

Then("the project count should read {string}", function (numOfProjects: string) {
  cy.getByQA("project-count").contains(`${numOfProjects} projects`);
});

And("the user will see project {string} listed", function (proj: string) {
  cy.getHeading(proj);
});

Then("the accordions should open", function () {
  ["Show all sections", "Upcoming", "Archived"].forEach(accordion => {
    cy.getButton(accordion).within(() => {
      cy.get(`button[aria-expanded="true"]`);
    });
  });
});

And("the user sees Upcoming and Archived buttons", function () {
  ["Upcoming", "Archived"].forEach(button => {
    cy.getButton(button);
  });
  cy.get("span").contains("Hide");
});
