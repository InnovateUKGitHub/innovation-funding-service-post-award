Feature: Run Apex
  This Gherkin syntax file is used to test the `ProjectFactory` fixture
  If this fails, Cypress tests that depend on running Anonymous Apex will fail.

  Scenario: Executing Salesforce anonymous Apex code
    Given a connection to Salesforce exists
