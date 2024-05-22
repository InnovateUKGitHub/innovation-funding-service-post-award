Feature: MSP Monitoring Reports
  Background: Project Setup
    Given a standard CR&D project exists

  Scenario Outline: User cannot enter invalid period numbers
    Given the user is the MO
    And the user is on the MSP monitoring reports
    When the user starts a new report in period <period>
    Then the period is rejected because <reason>

    Examples:
      | period  | reason                        |
      | ""      | a period has not been entered |
      | " "     | the period is out of range    |
      | "-1"    | the period is out of range    |
      | "allan" | the period is invalid         |
      | "1.5"   | the period is a non-integer   |

  Scenario Outline: Non MOs cannot see MSP reporting tile
    Given the user is the <role>
    And the user is on the project overview
    Then the user does not see the "Monitoring reports" tile

    Examples:
      | role |
      | PM   |
      | FC   |

  Scenario: User cannot complete an incomplete monitoring report
    Given the user is the MO
    And the user is on the MSP monitoring reports
    When the user starts a new report in period "1"
    And the user sees question 1
    And the user goes back 2 times
    And the user submits the report
    Then the report is rejected because "a score for scope" was missing
    Then the report is rejected because "comments for scope" was missing

  Scenario: User can create a monitoring report
    Given the user is the MO
    And the user is on the MSP monitoring reports
    When the user starts a new report in period "1"
    And the user sees question 1
    And the user goes back 3 times
    Then the user sees a period "1" report in "Draft"

  Scenario: User can complete the monitoring questions
    Given the user is the MO
    And the user is on the MSP monitoring reports
    When the user starts a new report in period "1"
    And the user answers the monitoring questions
    And the user submits the report
    Then the user sees a period "1" report in "Awaiting IUK Approval"
