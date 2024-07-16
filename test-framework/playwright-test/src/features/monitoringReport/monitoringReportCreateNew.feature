Feature: New Monitoring Report
  Scenario: Creating a new monitoring report
    Given a standard CR&D project exists
    And the user is on the project overview as a "Monitoring Officer"
    When the user selects the "Monitoring reports" tile
    And the user sees the Monitoring Reports page
    Then the user can start a new report
    And the user can complete section 1, "Scope"
    And the user can complete section 2, "Time"
    And the user can complete section 3, "Cost"
    And the user can complete section 4, "Exploitation"
    And the user can complete section 5, "Risk"
    And the user can complete section 6, "planning"
    And the user can complete "Summary"
    And the user can complete "Issues and actions"
    When the user clicks submit
    Then the user will see the report status "Awaiting IUK Approval"






