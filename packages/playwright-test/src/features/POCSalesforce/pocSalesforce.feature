@mode:serial
Feature: Playwright Salesforce POC
    Scenario: Running a test
        Given there is a CRnD Project with twelve Approved Claims
        Then that the Claims Participant and Project calculations are correct
        And that the Queues have been correctly assigned to the Claims
