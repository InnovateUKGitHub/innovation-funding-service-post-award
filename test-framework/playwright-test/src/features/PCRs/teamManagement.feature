@mode:serial
Feature: Manage team member
    Scenario: Selecting 'Manage team member' disables other PCR options
        Given a PM of a KTP project has created a new Project Change Request
        When the user selects the PCR type "Manage team members"
        Then other PCR Types are disabled and cannot be selected

    Scenario: Selecting PCR types disables 'Manage team member' as an option
        Given a PM of a KTP project has created a new Project Change Request
        When the user selects each PCR type
        Then the Manage team members PCR type is disabled
        Then the user cannot select Manage team members

    Scenario: Viewing the Manage team member PCR page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        Then the user will see the Manage team member page

    Scenario: Viewing the Replace project manager page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace project manager" button
        Then the user will see the Replace project manager page

    Scenario: Validating the replace project manager page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace project manager" button
        And the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    Scenario: Viewing the Replace finance contact page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace finance contact" button
        Then the user will see the Replace finance contact page

    Scenario: Validating the Replace finance contact page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace finance contact" button
        And the user selects a Finance contact
        And the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    Scenario: Viewing the Replace knowledge base administrator page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace knowledge base administrator" button
        Then the user will see the Replace knowledge base administator page

    Scenario: Validating the Replace knowledge base administrator page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace knowledge base administrator" button
        And the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    Scenario: Viewing the Replace main company contact page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace main company contact" button
        Then the user will see the Replace main company contact page

    Scenario: Validating the Replace main company contact page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace main company contact" button
        And the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    Scenario: Viewing the Invite a new associate page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Invite associate" button
        Then the user will see the Invite a new associate page

    Scenario: Validating the Invite associate page
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Manage team members" PCR
        And the user clicks the "Invite associate" button
        And the user clicks the "Send invitation" button
        Then an associate page validation message will advise of empty fields

        When the user exceeds 100 characters in the form fields
        And the user clicks the "Send invitation" button
        Then validation messages for each field will confirm length of 100 characters

        When the user enters alpha characters in the start date form
        And the user clicks the "Send invitation" button
        Then the validation messages for each field will confirm invalid characters

        When the user enters special characters in the start date form
        Then the validation messages for each field will confirm invalid characters

        When a valid date is entered in the start date form
        And the form is completed with 100 characters
        Then the validation messages will dynamically disappear

    Scenario: Completing and submitting Replace project manager
        Given a PM of a KTP project has created a new Project Change Request
        When the user creates a "Replace project manager" PCR
        And the user submits a valid "Replace project manager" PCR
        Then a "Replace project manager" confirmation screen is displayed