@mode:serial
Feature: Playwright Salesforce POC
    Scenario: Running a test
        Given there is a Competition created using the UI
        And there is a Project created using the UI
        And Contacts and Participants are added by the UI
        And Stattdate added and Project status changed to Live using the UI
