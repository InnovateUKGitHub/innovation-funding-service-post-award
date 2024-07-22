Feature: Run Apex
  This Gherkin syntax file is used to test the `SfdcLightningPage` fixture
  If this fails, Cypress tests that depend on logging into the Salesforce Lightning Experience will fail.

  Scenario: Logging into Salesforce Lightning Experience
    Given the internal user is on the salesforce lightning page
    Then the internal user sees the IFS Post Award app homepage
    And the internal user sees the "Recent Records" card
    And the internal user clicks on their profile icon
  # And the user sees the "Home" context bar item

  Scenario: Viewing a project
    Given the project number is "328407"
    Given the internal user is on the salesforce lightning page
    When the internal user clicks on the search button
    And the internal user searches for the project
    And the internal user clicks on the first project search result
    Then the internal user sees the project details

  Scenario: Viewing the monitoring reports
    Given the project number is "328407"
    And the internal user is on the project flexipage
    When the internal user goes to the "Monitoring Reports" tab
    Then the internal user sees over 30 results in the "Montitoring Answers" box
