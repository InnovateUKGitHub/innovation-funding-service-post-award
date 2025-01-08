@mode:serial
Feature: Change project duration

    Scenario: Creating and submitting a Change project duration PCR
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        And the user has navigated to the project change request page
        And the user creates a "Change project duration" PCR
        When the user clicks the "Change project duration" PCR type
        Then the user will see the Change project duration PCR page

        When the user submits a Change project duration PCR
        Then the user will see the submitted page for "Change project duration"

    Scenario: Reviewing a Change project duration PCR
        Given a multi-partner CR&D project exists
        And the user is the "mspUser" user
        When the user has navigated to the project change request page
        Then the "Change project duration" PCR has the status "Submitted to Monitoring Officer"

        When the user clicks review against "Change project duration"
        Then the user can see the request page for "Change project duration"

        When the user clicks the "Change project duration" PCR type
        Then the user can see the Change project duration summary with reasoning
            | Key            | List item                           |
            | Request number | 1                                   |
            | Types          | Change project duration             |
            | Comments       | This is the reasoning for this PCR. |
            | Files          | testfile.doc                        |

        When the user clicks back to request
        Then the user can see the request page for "Change project duration"

        When the user selects Query the request
        And the user enters comments for the "Project Manager"
        And the user clicks the submit button
        Then the "Change project duration" PCR has the status "Queried to Project Manager"

    Scenario: Resubmitting Change project duration PCR as Project Manager
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        And the user has navigated to the project change request page
        When the user accesses the queried "Change project duration" PCR
        Then the user can see the comments from the "Monitoring Officer"

        When the user enters comments for the "Monitoring Officer"
        And the user clicks the submit request button
        Then the user will see the submitted page for "Change project duration"

    Scenario: Reviewing and submitting Change project scope PCR as Monitoring Officer
        Given a multi-partner CR&D project exists
        And the user is the "mspUser" user
        And the user has navigated to the project change request page
        When the user clicks review against "Change project duration"
        Then the user can see the request page for "Change project duration"
        And the user can see the comments from the "Project Manager"

        When the user selects Send for approval
        And the user enters final comments
        And the user clicks the submit button
        Then the "Change project duration" PCR has the status "Submitted to Innovate UK"