@mode:serial
Feature: Contracts For Innovation Project Details
    Scenario: User access Project Details page
        Given a multi-partner Contracts for Innovation project exists
        And the user is the "mainFcUser" user
        And the user is on the project overview
        When the user selects the "Project details" tile
        Then "Contracts for Innovation" Project details will be displayed with correct information for "Finance Contact"
