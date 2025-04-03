@mode:serial

Feature: Change a partner's name PCR

    Scenario: Creating and submitting Change a partner's name PCR
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        When the user has created a new Change a partner's name PCR
        Then the Change a partner's name PCR is displayed

        When the user attempts to submit an empty Change a partner's name PCR
        Then validation messages will advise the PCR is empty

        When the user exceeds 256 characters in New partner name
        Then validation message will advice of character limit

        When the user submits a valid Change a partner's name PCR
        Then the user will see the submitted page for "Change a partner's name"
        And the Salesforce Marked as complete status is "Complete"

    Scenario: Reviewing a Change a partner's name PCR
        Given a multi-partner CR&D project exists
        And the user is the "mspUser" user
        When the user has navigated to the project change request page
        Then the "Change a partner's name" PCR has the status "Submitted to Monitoring Officer"

        When the user clicks review against "Change a partner's name"
        Then the user can see the request page for "Change a partner's name"

        When the user clicks the "Change a partner's name" PCR type
        Then the user can see a read-only Change a partner's name PCR with reasoning
            | Key            | List item                           |
            | Request number | 1                                   |
            | Types          | Change a partner's name             |
            | Comments       | This is the reasoning for this PCR. |
            | Files          | testfile.doc                        |