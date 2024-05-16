import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

When("Cypress tries to create a project", function () {
  cy.createProject();
});

Then("the user sees the project", function () {
  cy.recallProject().then(x => {
    cy.getByQA(`project-${x.project.number}`).should("exist");
  });
});
