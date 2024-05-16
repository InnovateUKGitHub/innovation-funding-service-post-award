import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("a standard CR&D project exists", () => {
  cy.recallProject().then(project => {
    if (!project) {
      cy.createProject();
    }
  });
});
