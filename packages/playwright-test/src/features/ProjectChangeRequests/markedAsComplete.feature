@mode:serial
Feature: Salesforce back-end Marked as complete status
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
        And the Salesforce Marked as complete status is "To Do"

        When the user clicks the "Save and continue" button
        Then the partner certificate page is displayed
        And the Salesforce Marked as complete status is "Incomplete"

        When the user clicks the "Save and continue" button
        Then the user will see the Mark as complete subheading
        And the Salesforce Marked as complete status is "Incomplete"

    Scenario: Creating and saving Change project scope updates status correctly
        When the user creates a "Change project scope" PCR
        And the user clicks the "Change project scope" PCR type
        Then the Change project scope page is displayed
        And the Salesforce Marked as complete status is "To Do"

        When the user clicks back to request
        Then the Salesforce Marked as complete status is "To Do"

        When the user clicks the "Change project scope" PCR type
        And the Change project scope page is displayed
        And the user clicks the "Save and continue" button
        Then the user will see the Proposed project summary page
        And the Salesforce Marked as complete status is "Incomplete"

        When the user clicks the "Save and continue" button
        Then the user will see the Mark as complete subheading
        And the Salesforce Marked as complete status is "Incomplete"

        When the user clicks Edit against Public description
        And the user saves a change to the Project description
        Then the Salesforce Marked as complete status is "Incomplete"

        When the user clicks the "Save and continue" button
        Then the user will see the Mark as complete subheading
        And the Salesforce Marked as complete status is "Incomplete"

        When the user marks as complete and saves
        And the user will see the PCR Request screen
        Then the Salesforce Marked as complete status is "Complete"
#








