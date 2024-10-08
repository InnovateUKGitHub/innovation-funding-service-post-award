Feature: Project details
    Scenario: Reviewing the project details page
        Given a standard CR&D project exists
        And the user is a project manager
        And the user is on the project overview
        When the user selects the "Project details" tile
        Then Project details will be displayed with correct information