import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("the user is on the developer homepage", function () {
  cy.goToDeveloperHomepage();
});

Given("the user is on the projects dashboard", function () {
  cy.goToProjectsDashboard();
});

Given("the user is on the project overview", function () {
  cy.goToProjectOverview(this);
});

Given("the user is on the MSP document share", function () {
  cy.goToMspDocumentShare(this);
});

Given("the user is on the MSP monitoring reports", function () {
  cy.goToMspMonitoringReport(this);
});

Given("the user is on the broadcast page", function (title: string) {
  cy.goToBroadcastPage();
});
