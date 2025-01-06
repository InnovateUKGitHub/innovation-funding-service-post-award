@mode:serial

Feature: Manage team member
    Background:
        Given a PM of a KTP project has created a new Project Change Request

    Scenario: Selecting 'Manage team member' disables other PCR options
        When the user selects the PCR type "Manage team members"
        Then other PCR Types are disabled and cannot be selected

    Scenario: Selecting PCR types disables 'Manage team member' as an option
        When the user selects each PCR type
        Then the Manage team members PCR type is still enabled

        When the user selects Manage team member
        Then the other PCR types are then disabled

    Scenario: Viewing the Manage team member PCR page
        When the user creates a "Manage team members" PCR
        Then the user will see the Manage team member page

    Scenario: Validating the replace project manager page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace project manager" button
        Then the user will see the Replace project manager page

        When the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the email entered is not in an email format
        Then the validation message will confirm an invalid email

        When the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    Scenario: Validating the Replace finance contact page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace finance contact" button
        Then the user will see the Replace finance contact page

        When the user selects a Finance contact
        And the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    Scenario: Validating the Replace knowledge base administrator page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace knowledge base administrator" button
        Then the user will see the Replace knowledge base administator page

        When the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    Scenario: Validating the Replace main company contact page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace main company contact" button
        Then the user will see the Replace main company contact page

        When the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    #This step previously failed until ticket ACC-11681 was resolved
    Scenario: Validating the Invite associate page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Invite associate" button
        Then the user will see the Invite a new associate page

        When the user clicks the "Send invitation" button
        Then an associate page validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the user enters alpha characters in the start date form
        And the user clicks the "Send invitation" button
        Then the validation messages for each field will confirm invalid alpha characters

        When the user enters special characters in the start date form
        Then the validation messages for each field will confirm invalid special characters

        When a valid date is entered in the start date form
        And the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    Scenario: Completing and submitting Replace finance contact
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace finance contact" button
        And the user submits a valid "Replace finance contact" PCR
        Then a "Replace finance contact" confirmation screen is displayed

    Scenario: Completing and submitting Replace knowledge base administrator
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace knowledge base administrator" button
        And the user submits a valid "Replace knowledge base administrator" PCR
        Then a "Replace knowledge base administrator" confirmation screen is displayed

    Scenario: Completing and submitting Replace main company contact
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace main company contact" button
        And the user submits a valid "Replace main company contact" PCR
        Then a "Replace main company contact" confirmation screen is displayed

    Scenario: Completing and submitting Replace project manager
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace project manager" button
        And the user submits a valid "Replace project manager" PCR
        Then a "Replace project manager" confirmation screen is displayed

    Scenario: Completing and submitting Invite a new associate
        When the user creates a "Manage team members" PCR
        And the user clicks the "Invite associate" button
        And the user submits a valid "Invite a new associate" PCR
        Then a "Invite a new associate" confirmation screen is displayed