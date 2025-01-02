@mode:serial
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

    Scenario: Reviewing Remove a partner as MO
        Given a multi-partner CR&D project exists
        And the user is the "mspUser" user
        When the user has navigated to the project change request page
        Then the "Remove a partner" PCR has the status "Submitted to Monitoring Officer"

        When the user clicks review against "Remove a partner"
        Then the user can see the request page for "Remove a partner"

        When the user clicks the "Remove a partner" PCR type
        Then the user can see the Remove a partner PCR summary

            | Section               | Content                |
            | Partner being removed | Hedge's Secondary Ltd. |
            | Last period           | 5                      |
            | Documents             | add.png                |

        When the user clicks back to request
        Then the user can see the request page for "Remove a partner"

        When the user selects Query the request
        And the user enters comments for the "Project Manager"
        And the user clicks the submit button
        Then the "Remove a partner" PCR has the status "Queried to Project Manager"

    Scenario: Project manager can re-access and resubmit PCR
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        When the user has navigated to the project change request page
        Then the "Remove a partner" PCR has the status "Queried to Project Manager"

        When the user accesses the queried "Remove a partner" PCR
        Then the user can see the comments from the "Monitoring Officer"

        When the user enters comments for the "Monitoring Officer"
        And the user clicks the submit request button
        Then the user will see the submitted page for "Remove a partner"

    Scenario: MO Can submit to Innovate UK
        Given a multi-partner CR&D project exists
        And the user is the "mspUser" user
        When the user has navigated to the project change request page
        Then the "Remove a partner" PCR has the status "Submitted to Monitoring Officer"

        When the user clicks review against "Remove a partner"
        Then the user can see the request page for "Remove a partner"

        When the user selects Send for approval
        And the user enters comments for the "Innovate UK"
        And the user clicks the submit button
        Then the "Remove a partner" PCR has the status "Submitted to Innovate UK"

