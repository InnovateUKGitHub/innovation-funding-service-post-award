Feature: AccTask runApex
  This Gherkin syntax file is used to test the `cy.accTask("runApex")`
  If this fails, Cypress tests that depend on running Anonymous Apex will fail.

  Scenario: Executing Salesforce anonymous Apex code
    When Cypress tries to run Hello World Apex
