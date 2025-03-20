@mode:serial

Feature: Project setup submission
    Scenario: Completing and submitting project setup
        Given a multi-partner CR&D project exists in Project setup state
        And the user is the "mainFcUser" user
        When the user navigates to the Project Setup page
        Then the user will see the initial "editable" Project setup page

        When the user completes their spend profile
            | Category               |
            | Labour                 |
            | Overheads              |
            | Materials              |
            | Capital usage          |
            | Subcontracting         |
            | Travel and subsistence |
            | Other costs            |
            | Other costs 2          |
            | Other costs 3          |
            | Other costs 4          |
            | Other costs 5          |
        And the user completes the Provide your bank details section
            | Field          | Value              |
            | Company number | Test12345          |
            | Sort code      | 000004             |
            | Account number | 12345677           |
            | Building       | Big Office         |
            | Street         | Corporation Street |
            | Locality       | Corporation area   |
            | Town or city   | Corporation town   |
            | Postcode       | SN1 1AB            |
        And the user clicks the "Submit bank details" button
        Then the user will see the Confirm your bank details page
            | Field             | Value                | qaTag             |
            | Organisation name | Hedge's Primary Ltd. | organisationName  |
            | Company number    | Test12345            | companyNumber     |
            | Sort code         | XX0004               | sortCode          |
            | Account number    | XXXX5677             | accountNumber     |
            | Building          | Big Office           | accountBuilding   |
            | Street            | Corporation Street   | accountStreet     |
            | Locality          | Corporation area     | accountLocality   |
            | Town or city      | Corporation town     | accountTownOrCity |
            | Postcode          | SN1 1AB              | accountPostcode   |

        When the user uploads the bank statement and submits bank details
        Then the "Provide your bank details" section will show as "Complete"

        When the user completes their project location setup
        Then the "Provide your project location postcode" section will show as "Complete"

        When the user clicks the "Complete project setup" button
        And the internal user is on the project flexipage
        Then the participant status will show as 'Active'

