import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the user sees the project", function () {
  cy.recallProject().then(x => {
    cy.getByQA(`project-${x.project.number}`).should("exist");
  });
});
