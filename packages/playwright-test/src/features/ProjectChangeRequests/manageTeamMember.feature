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

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When the email entered is not in an email format
        Then the validation message will confirm an invalid email

        When the form is completed with 80 characters
        Then the validation messages will dynamically disappear

    Scenario Outline: Validating Replace project manager date fields
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace project manager" button
        Then the user will see the Replace project manager page

        When the user enters invalid "<information>" in the date "<field>"
        And the user clicks the "Send invitation" button
        Then the user will see the date validation "<message>"

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When the email entered is not in an email format
        Then the validation message will confirm an invalid email

        When the form is completed with 80 characters
        Then the validation messages will dynamically disappear

        Examples:
            | information | field | message                                               |
            |             | Day   | End date must include a day.                          |
            |             | Month | End date must include a month.                        |
            |             | Year  | End date must include a year.                         |
            | 32          | Day   | End date must be a real date.                         |
            | 2000        | Day   | End date must be a real date.                         |
            | lorem       | Day   | End date must be a real date.                         |
            | &^%         | Day   | End date must be a real date.                         |
            | -01         | Day   | End date must be a real date.                         |
            | 13          | Month | End date must be a real date.                         |
            | 2000        | Month | End date must be a real date.                         |
            | lorem       | Month | End date must be a real date.                         |
            | &^%         | Month | End date must be a real date.                         |
            | -01         | Month | End date must be a real date.                         |
            | 1066        | Year  | End date must be the same as or after 1 January 2000. |
            | 1999        | Year  | End date must be the same as or after 1 January 2000. |
            | lorem       | Year  | End date must be a real date.                         |
            | &^%         | Year  | End date must be a real date.                         |
            | -01         | Year  | End date must be the same as or after 1 January 2000. |

    Scenario: Validating the Replace finance contact page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace finance contact" button
        Then the user will see the Replace finance contact page

        When the user selects a Finance contact
        And the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When the form is completed with 80 characters
        Then the validation messages will dynamically disappear

    Scenario Outline: Validating Replace finance contact date fields
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace finance contact" button
        Then the user will see the Replace finance contact page

        When the user enters invalid "<information>" in the date "<field>"
        And the user clicks the "Send invitation" button
        Then the user will see the date validation "<message>"

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When the form is completed with 80 characters
        Then the validation messages will dynamically disappear

        Examples:
            | information | field | message                                               |
            |             | Day   | End date must include a day.                          |
            |             | Month | End date must include a month.                        |
            |             | Year  | End date must include a year.                         |
            | 32          | Day   | End date must be a real date.                         |
            | 2000        | Day   | End date must be a real date.                         |
            | lorem       | Day   | End date must be a real date.                         |
            | &^%         | Day   | End date must be a real date.                         |
            | -01         | Day   | End date must be a real date.                         |
            | 13          | Month | End date must be a real date.                         |
            | 2000        | Month | End date must be a real date.                         |
            | lorem       | Month | End date must be a real date.                         |
            | &^%         | Month | End date must be a real date.                         |
            | -01         | Month | End date must be a real date.                         |
            | 1066        | Year  | End date must be the same as or after 1 January 2000. |
            | 1999        | Year  | End date must be the same as or after 1 January 2000. |
            | lorem       | Year  | End date must be a real date.                         |
            | &^%         | Year  | End date must be a real date.                         |
            | -01         | Year  | End date must be the same as or after 1 January 2000. |

    Scenario: Validating the Replace knowledge base administrator page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace knowledge base administrator" button
        Then the user will see the Replace knowledge base administator page

        When the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When the form is completed with 80 characters
        Then the validation messages will dynamically disappear

    Scenario Outline: Validating Replace KB Admin date fields
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace knowledge base administrator" button
        Then the user will see the Replace knowledge base administator page

        When the user enters invalid "<information>" in the date "<field>"
        And the user clicks the "Send invitation" button
        Then the user will see the date validation "<message>"

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When the form is completed with 80 characters
        Then the validation messages will dynamically disappear

        Examples:
            | information | field | message                                               |
            |             | Day   | End date must include a day.                          |
            |             | Month | End date must include a month.                        |
            |             | Year  | End date must include a year.                         |
            | 32          | Day   | End date must be a real date.                         |
            | 2000        | Day   | End date must be a real date.                         |
            | lorem       | Day   | End date must be a real date.                         |
            | &^%         | Day   | End date must be a real date.                         |
            | -01         | Day   | End date must be a real date.                         |
            | 13          | Month | End date must be a real date.                         |
            | 2000        | Month | End date must be a real date.                         |
            | lorem       | Month | End date must be a real date.                         |
            | &^%         | Month | End date must be a real date.                         |
            | -01         | Month | End date must be a real date.                         |
            | 1066        | Year  | End date must be the same as or after 1 January 2000. |
            | 1999        | Year  | End date must be the same as or after 1 January 2000. |
            | lorem       | Year  | End date must be a real date.                         |
            | &^%         | Year  | End date must be a real date.                         |
            | -01         | Year  | End date must be the same as or after 1 January 2000. |

    Scenario: Validating the Replace main company contact page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace main company contact" button
        Then the user will see the Replace main company contact page

        When the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When the form is completed with 80 characters
        Then the validation messages will dynamically disappear

    Scenario Outline: Validating Replace main company contact date fields
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace main company contact" button
        Then the user will see the Replace main company contact page

        When the user clicks the "Confirm replacement and send invitation" button
        Then a standard validation message will advise of empty fields

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Confirm replacement and send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When the form is completed with 80 characters
        Then the validation messages will dynamically disappear

    #This step previously failed until ticket ACC-11681 was resolved
    Scenario: Validating the Invite associate page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Invite associate" button
        Then the user will see the Invite a new associate page

        When the user clicks the "Send invitation" button
        Then an associate page validation message will advise of empty fields

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When a correct and valid date is entered as the start date
        Then the validation messages will dynamically disappear

        Examples:
            | information | field | message                                               |
            |             | Day   | End date must include a day.                          |
            |             | Month | End date must include a month.                        |
            |             | Year  | End date must include a year.                         |
            | 32          | Day   | End date must be a real date.                         |
            | 2000        | Day   | End date must be a real date.                         |
            | lorem       | Day   | End date must be a real date.                         |
            | &^%         | Day   | End date must be a real date.                         |
            | -01         | Day   | End date must be a real date.                         |
            | 13          | Month | End date must be a real date.                         |
            | 2000        | Month | End date must be a real date.                         |
            | lorem       | Month | End date must be a real date.                         |
            | &^%         | Month | End date must be a real date.                         |
            | -01         | Month | End date must be a real date.                         |
            | 1066        | Year  | End date must be the same as or after 1 January 2000. |
            | 1999        | Year  | End date must be the same as or after 1 January 2000. |
            | lorem       | Year  | End date must be a real date.                         |
            | &^%         | Year  | End date must be a real date.                         |
            | -01         | Year  | End date must be the same as or after 1 January 2000. |

    #This step previously failed until ticket ACC-11681 was resolved
    Scenario: Validating the Invite associate page
        When the user creates a "Manage team members" PCR
        And the user clicks the "Invite associate" button
        Then the user will see the Invite a new associate page

        When the user clicks the "Send invitation" button
        Then an associate page validation message will advise of empty fields

        When the user exceeds 80 characters in the form fields
        And the user clicks the "Send invitation" button
        Then validation messages for each field will confirm length of 80 characters

        When a correct and valid date is entered as the start date
        And the form is completed with 80 characters
        Then the validation messages will dynamically disappear

    Scenario Outline: Validating Invite associate Date fields
        When the user creates a "Manage team members" PCR
        And the user clicks the "Invite associate" button
        Then the user will see the Invite a new associate page

        When the user enters invalid "<information>" in the date "<field>"
        And the user clicks the "Send invitation" button
        Then the user will see the date validation "<message>"

        When a correct and valid date is entered as the start date
        Then the validation messages will dynamically disappear

        Examples:
            | information | field | message                                                 |
            |             | Day   | Start date must include a day.                          |
            |             | Month | Start date must include a month.                        |
            |             | Year  | Start date must include a year.                         |
            | 32          | Day   | Start date must be a real date.                         |
            | 2000        | Day   | Start date must be a real date.                         |
            | lorem       | Day   | Start date must be a real date.                         |
            | &^%         | Day   | Start date must be a real date.                         |
            | -01         | Day   | Start date must be a real date.                         |
            | 13          | Month | Start date must be a real date.                         |
            | 2000        | Month | Start date must be a real date.                         |
            | lorem       | Month | Start date must be a real date.                         |
            | &^%         | Month | Start date must be a real date.                         |
            | -01         | Month | Start date must be a real date.                         |
            | 1066        | Year  | Start date must be the same as or after 1 January 2000. |
            | 1999        | Year  | Start date must be the same as or after 1 January 2000. |
            | lorem       | Year  | Start date must be a real date.                         |
            | &^%         | Year  | Start date must be a real date.                         |
            | -01         | Year  | Start date must be the same as or after 1 January 2000. |

    Scenario Outline: Validating different date ranges of Invite Associate
        When the user creates a "Manage team members" PCR
        And the user clicks the "Invite associate" button
        Then the user will see the Invite a new associate page

        When the user sets a date in the future as 01 "<month>" in the date "<year>"
        And the user clicks the "Send invitation" button
        Then a "Invite a new associate" confirmation screen is displayed

        Examples:
            | month | year |
            | 01    | 2028 |
            | 02    | 2027 |
            | 03    | 2026 |
            | 04    | 2027 |
            | 05    | 2029 |
            | 06    | 2026 |
            | 07    | 2030 |
            | 08    | 2029 |
            | 09    | 2040 |
            | 10    | 2027 |
            | 11    | 2035 |
            | 12    | 2026 |

    Scenario: Completing and submitting Replace project manager
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace project manager" button
        And the user submits a valid "Replace project manager" PCR
        Then a "Replace project manager" confirmation screen is displayed

        When the user accesses the Project Factory project in Salesforce
        And the user accesses the "Project Manager" PCL
        Then the user will see the end date populated

    Scenario: Completing and submitting Replace finance contact
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace finance contact" button
        And the user submits a valid "Replace finance contact" PCR
        Then a "Replace finance contact" confirmation screen is displayed

        When the user accesses the Project Factory project in Salesforce
        And the user accesses the "Main Finance Contact" PCL
        Then the user will see the end date populated

    Scenario: Completing and submitting Replace knowledge base administrator
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace knowledge base administrator" button
        And the user submits a valid "Replace knowledge base administrator" PCR
        Then a "Replace knowledge base administrator" confirmation screen is displayed

        When the user accesses the Project Factory project in Salesforce
        And the user accesses the "Knowledge Base" PCL
        Then the user will see the end date populated

    Scenario: Completing and submitting Replace main company contact
        When the user creates a "Manage team members" PCR
        And the user clicks the "Replace main company contact" button
        And the user submits a valid "Replace main company contact" PCR
        Then a "Replace main company contact" confirmation screen is displayed

        When the user accesses the Project Factory project in Salesforce
        And the user accesses the "Main Contact" PCL
        Then the user will see the end date populated

    Scenario: Completing and submitting Invite a new associate
        When the user creates a "Manage team members" PCR
        And the user clicks the "Invite associate" button
        And the user submits a valid "Invite a new associate" PCR
        Then a "Invite a new associate" confirmation screen is displayed
        And the correct start date is visible

    Scenario: Removing an existing associate
        When the user creates a "Manage team members" PCR
        And the user clicks Remove next to the existing associate
        Then the Remove associate page is displayed

        When the user clicks the Remove associate button
        Then a "Manage team members" confirmation screen is displayed