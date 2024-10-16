Feature: Remove a partner

    Scenario: Accessing pcrs as multi-partner
        Given a multi-partner CR&D project exists
        And the user is a project manager
        And the user is on the project overview
        When the user selects the "Project change requests" tile
        Then the project change request page is displayed