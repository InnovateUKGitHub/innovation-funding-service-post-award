Feature: Project Dashboard
  Scenario: Projects Dashboard
    Given a multi-partner CR&D project exists
    And the user is the "pmUser" user
    And the user is on the project dashboard
    Then the user sees the project dashboard
