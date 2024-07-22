@mode:serial
Feature: New Monitoring Report
  Background:
    Given a standard CR&D project exists
    And the user is a monitoring officer

  Scenario: Can navigate to the monitoring reports page
    Given the user is on the project overview
    When the user selects the "Monitoring reports" tile
    And the user sees the monitoring reports page

  Scenario: Creating a new monitoring report
    Given the user is on the monitoring reports page
    Then the user can start a new report
    And the user can complete the monitoring report
    When the user clicks submit
    Then the user sees the report status is "Awaiting IUK Approval"
    When the internal user is on the project flexipage
    And the internal user goes to the "Monitoring Reports" tab
    Then the internal user sees 1 result in the "Monitoring Answers" box
