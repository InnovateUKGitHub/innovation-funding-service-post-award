@mode:serial
Feature: Change project scope

    Scenario: Creating and submitting Change project scope PCR
        Given a standard CR&D project exists
        And the user is a project manager
        And the user has navigated to the project change request page
        And the user creates a "Change project scope" PCR
        When the user clicks the "Change project scope" PCR type
        Then the Change project scope page is displayed

        When the user navigates through to summary and marks as complete
        Then validation messages will advise of empty sections

        When the user clicks an Edit button
        Then the user is brought to the correct page

        When the user validates 32000 characters in each section correctly
        Then a completed summary page is displayed

        When the user clicks Save and return to request
        Then the request page will show "Change project scope" as "Complete"

        When the user completes the reasons section
        And the user clicks Submit request
        Then the user will see the submitted page for "Change project scope"

    Scenario: Reviewing a Change project scope PCR as Monitoring Officer
        Given a standard CR&D project exists
        And the user is a monitoring officer
        And the user has navigated to the project change request page
        When the user clicks review against "Change project scope"
        Then the user can see the request page for "Change project scope"

        When the user clicks the "Change project scope" PCR type
        Then a read-only summary page is displayed

        When the user clicks Next - Reasoning
        Then the reasoning page displays the following
            | Key            | List item                                                                                            |
            | Request number | 1                                                                                                    |
            | Types          | Change project scope                                                                                 |
            | Comments       | If you ever need a reason to go to the office in Swindon, consider the fact that every third wednesd |
            | Key            | List item                                                                                            |
            | Files          | No documents attached                                                                                |

        When the user clicks back to request
        Then the user can see the request page for "Change project scope"

        When the user selects Query the request
        And the user enters comments for the "Project Manager"
        And the user clicks the submit button
        Then the "Change project scope" PCR has the status "Queried to Project Manager"

    Scenario: Resubmitting Change project scope PCR as Project Manager
        Given a standard CR&D project exists
        And the user is a project manager
        And the user has navigated to the project change request page
        When the user accesses the queried "Change project scope" PCR
        Then the user can see the comments from the "Monitoring Officer"

        When the user enters comments for the "Monitoring Officer"
        And the user clicks the submit request button
        Then the user can see the request page for "Change project scope"

    Scenario: Reviewing and submitting Change project scope PCR as Monitoring Officer
        Given a standard CR&D project exists
        And the user is a monitoring officer
        And the user has navigated to the project change request page
        When the user clicks review against "Change project scope"
        Then the user can see the request page for "Change project scope"
        And the user can see the comments from the "Project Manager"

        When the user selects Send for approval
        And the user enters final comments
        And the user clicks the submit button
        Then the "Change project scope" PCR has the status "Submitted to Innovate UK"