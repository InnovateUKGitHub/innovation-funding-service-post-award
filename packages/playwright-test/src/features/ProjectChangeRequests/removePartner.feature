Feature: Remove a partner

    # This requires further work to properly validate file components and also empty PCR upon mark as complete.
    # A future ticket ACC-11574 will convert file component test steps which can then be brought into this test.

    Scenario: Completing a Remove partner PCR
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        And the user has navigated to the project change request page
        And the user creates a "Remove a partner" PCR
        When the user clicks the "Remove a partner" PCR type
        Then the user sees the Remove a partner selection page

        When the user enters an invalid last period number
        Then the correct validation message will display

        When the user enters a valid last period
        And clicks save and continue
        Then the partner certificate page is displayed

        When the user clicks upload without selecting a document
        Then a choose file validation message is displayed

        When the user uploads a file
        And the user clicks Save and continue
        Then the Remove a partner summary page is displayed

        When the user marks as complete and saves
        Then the request page will show "Remove a partner" as "Complete"

        When the user completes the reasons section
        And the user clicks Submit request
        Then the user will see the submitted page for "Remove a partner"
