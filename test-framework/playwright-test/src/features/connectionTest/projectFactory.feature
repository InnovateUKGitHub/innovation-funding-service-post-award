Feature: Project Factory - External UI Project Creation Tool
  This Gherkin syntax file is used to test the `AccProjectBase` fixture
  If this fails, Cypress tests that depend on running Anonymous Apex will fail.

  # Scenario: Executing Salesforce anonymous Apex code
  #   When Cypress tries to run Apex

  Scenario: Creating a basic project
    Given a standard CR&D project exists
    When the user is on the project dashboard
    Then the user sees the project

# Scenario: Creating a project with PCRs
#   Given a CR&D project exists with PCR items exists
#   When the user is on the projects dashboard
#   Then the user sees the project
