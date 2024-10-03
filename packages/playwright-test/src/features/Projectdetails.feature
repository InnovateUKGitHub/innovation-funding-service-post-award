Feature: Project Details Page
    Scenario: Viewing Project Details Page
        Given a standard CR&D project exists
        And the user is a project manager
        And the user is on the project overview
        When the user selects the "Project details" tile
        Then the project details page is displayed


