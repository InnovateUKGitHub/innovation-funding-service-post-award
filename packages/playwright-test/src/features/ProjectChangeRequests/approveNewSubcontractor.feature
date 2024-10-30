@mode:serial
Feature: Approve a new subcontractor

    Background:
        Given a standard CR&D project exists
        And the user is a project manager
        And the user is on the project overview
        When the user selects the "Project change requests" tile
        Then the project change request page is displayed

    Scenario: Validating an empty Approve a new subcontractor PCR
        Given the user sees the project request page
        And the user creates a "Approve a new subcontractor" PCR
        And the user clicks the "Approve a new subcontractor" PCR type
        When the user attempts to mark as complete and save
        Then validation messages will advise of empty fields

        When the user clicks one of the Edit links
        And the user is on the editable page
        Then the validation messages will persist

        When the user enters text into each field
        Then the validation messages will dynamically disappear

    Scenario: Validating the text boundaries and currency of Approve a new subcontractor PCR
        Given the user has created and is in Approve a new subcontractor
        When the user exceeds the allowed character limit

            | Field name                                                                          | Character limit |
            | Company name of subcontractor                                                       | 255             |
            | Company registration number                                                         | 20              |
            | Please describe the relationship between the collaborator and the new subcontractor | 16000           |
            | Country where the subcontractor's work will be carried out                          | 100             |
            | Brief description of work to be carried out by subcontractor                        | 255             |
            | Justification                                                                       | 32000           |

        And clicks save and continue
        Then character limit validation messages are displayed

        When the user enters text within the character limit
            | Field name                                                                          | Character limit |
            | Company name of subcontractor                                                       | 255             |
            | Company registration number                                                         | 20              |
            | Please describe the relationship between the collaborator and the new subcontractor | 16000           |
            | Country where the subcontractor's work will be carried out                          | 100             |
            | Brief description of work to be carried out by subcontractor                        | 255             |
            | Justification                                                                       | 32000           |
        Then the characters remaining will read 0
        And the validation messages will no longer appear

        When the user enters invalid characters in Cost of work
            | Characters to enter | Validation message                                                                               |
            | Lorem ipsum         | The cost of work to be carried out by the new subcontractor must be a number.                    |
            | *                   | The cost of work to be carried out by the new subcontractor must be a number.                    |
            | !                   | The cost of work to be carried out by the new subcontractor must be a number.                    |
            | $1                  | The cost of work to be carried out by the new subcontractor must be in pounds (£).               |
            | €1                  | The cost of work to be carried out by the new subcontractor must be in pounds (£).               |
            | 99.999              | The cost of work to be carried out by the new subcontractor must be 2 decimal places or fewer.   |
            | 0.111               | The cost of work to be carried out by the new subcontractor must be 2 decimal places or fewer.   |
            | 8.888               | The cost of work to be carried out by the new subcontractor must be 2 decimal places or fewer.   |
            | 9999999999999       | The cost of work to be carried out by the new subcontractor must be £999,999,999,999.00 or less. |
            | -100                | The cost of work to be carried out by the new subcontractor must be £0.00 or more.               |
        Then the correct validation message is displayed

        When the user enters "1000.33" pounds in the currency field
        Then the currency validation will dynamically disappear

        When the user clicks Save and continue
        Then the summary page correctly displays the saved information
            | Field name                                                                          | Lorem | Summary position |
            | Company name of subcontractor                                                       | 255   | 1                |
            | Company registration number                                                         | 20    | 2                |
            | Please describe the relationship between the collaborator and the new subcontractor | 16000 | 4                |
            | Country where the subcontractor's work will be carried out                          | 100   | 5                |
            | Brief description of work to be carried out by subcontractor                        | 255   | 6                |
            | Justification                                                                       | 32000 | 8                |

    Scenario: Marking relationship from Yes to No
        Given the user has created and is in Approve a new subcontractor
        When the user enters comment in the relationship box
        And the user clicks Save and continue
        Then the saved text will appear on the summary screen

        When the user clicks one of the Edit links
        And the user selects relationship as "No"
        And the user clicks Save and continue
        Then the information will have been deleted

    Scenario: The user can complete a valid Approve a new subcontractor PCR
        Given the user has created and is in Approve a new subcontractor
        When the user completes the Approve a new subcontractor form
        And the user attempts to mark as complete and save
        Then the request page will show "Approve a new subcontractor" as "Complete"

        When the user completes the reasons section
        And the user clicks Submit request
        Then the user will see the submitted page for "Approve a new subcontractor"
