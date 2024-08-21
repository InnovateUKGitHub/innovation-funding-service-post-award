@mode:serial
Feature: New Monitoring Report
  Scenario: Completing Monitoring Report
    Given a standard CR&D project exists
    And the user is a monitoring officer
    Then the user is on the project overview

    When the user selects the "Monitoring reports" tile
    Then the user sees the monitoring reports page

    When the user clicks start a new report
    Then the user will see the create page with period box

    When the user completes the monitoring report
    Then the user will see the completed summary page

    When the user submits the report
    Then the user sees the report status is "Awaiting IUK Approval"

    When the internal user is on the project flexipage
    And the internal user goes to the "Monitoring Reports" tab
    Then the internal user sees 1 result in the "Monitoring Answers" box
