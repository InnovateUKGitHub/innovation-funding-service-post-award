Feature: Project Factory - External UI Project Creation Tool
  This Gherkin syntax file is used to test the `AccProjectBase` fixture
  If this fails, Cypress tests that depend on running Anonymous Apex will fail.

  Scenario: Creating a multi-partner project project
    Given a multi-partner CR&D project with profiles exists
    When the user is on the project dashboard
