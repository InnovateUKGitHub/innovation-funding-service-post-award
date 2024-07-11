Feature: Developer Homepage
  Scenario: Content Solution
    Given the user is on the developer homepage
    When the user selects the content solution tile
    Then the user sees the developer homepage

  Scenario: Projects Dashboard
    Given the user is on the developer homepage
    When the user selects the projects tile
    Then the user sees the project dashboard
