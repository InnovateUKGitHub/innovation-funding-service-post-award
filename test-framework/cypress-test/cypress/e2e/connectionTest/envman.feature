Feature: envman Connection Test
  This Gherkin syntax file is used to test the `cy.accTask("runApex")`
  If this fails, Cypress tests that depend on running Anonymous Apex will fail.

  # Scenario: Executing Salesforce anonymous Apex code
  #   When Cypress tries to run Apex

  Scenario: Creating a basic project
    When Cypress tries to create a project
    Given the user is on the projects dashboard
