@mode:serial
Feature: Marked as complete status
    # Created off the back of ACC-11961. To be expanded on later.
    Background:
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        And the user is on the project overview
        When the user selects the "Project change requests" tile
        Then the project change request page is displayed

    Scenario: Creating and saving Remove a partner PCR updates status correctly
        When the user creates a "Remove a partner" PCR
        And the user clicks the "Remove a partner" PCR type
        Then the user sees the Remove a partner selection page
        And the Marked as complete status is "To Do"

        When the user clicks the "Save and continue" button
        Then the partner certificate page is displayed
        And the Marked as complete status is "Incomplete"

        When the user clicks the "Save and continue" button
        Then the user will see the Mark as complete subheading
        And the Marked as complete status is "Incomplete"







