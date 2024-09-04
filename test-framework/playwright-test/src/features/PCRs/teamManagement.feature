@mode:serial
Feature: Manage team member
    Scenario: Selecting 'Manage team member' disables other PCR options
        Given a standard CR&D project exists
        And the user is a project manager
        Then the user is on the project overview

        When the user selects the "Project change requests" tile
        Then the user sees the project change requests page

        When the user clicks the Create request button
        Then the user is taken to the 'Start a new request' page

        When the user selects the PCR type "Manage team members"
        Then other PCR Types are disabled and cannot be selected

    Scenario: Selecting PCR types disables 'Manage team member' as an option
        Given a standard CR&D project exists
        And the user is a project manager
        Then the user is on the project overview

        When the user selects the "Project change requests" tile
        Then the user sees the project change requests page

        When the user clicks the Create request button
        Then the user is taken to the 'Start a new request' page

        When the user selects each PCR type
        Then the Manage team members PCR type is disabled
        Then the user cannot select Manage team members


