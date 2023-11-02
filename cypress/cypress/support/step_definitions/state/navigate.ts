import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("the user is on the developer homepage", function () {
  cy.goToDeveloperHomepage();
});

Given("the user is on the projects dashboard", () => {
  cy.goToProjectsDashboard();
});

Given("the user is on the project overview", () => {
  cy.goToProjectOverview(this);
});

Given("the user is on the MSP document share", function () {
  cy.goToMspDocumentShare(this);
});
