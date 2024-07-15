Feature: New Monitoring Report
  Scenario: Creating a new monitoring report
    Given a standard CR&D project exists

    And the user is on the project overview as a "Monitoring Officer"
    When the user selects the "Monitoring reports" tile
    Then the user sees the Monitoring Reports page
