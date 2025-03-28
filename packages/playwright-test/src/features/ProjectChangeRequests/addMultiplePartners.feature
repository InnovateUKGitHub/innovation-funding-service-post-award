@mode:serial
Feature: Add multiple partners

    Background:
        Given a standard CR&D project exists
        And the user is the "pmUser" user
        And the user is on the project overview
        When the user selects the "Project change requests" tile
        Then the project change request page is displayed

    Scenario: First partner
        When the user selects a partner
        When the user completes the new partner info
        And the user navigates to the next page

    Scenario: Company house
        Given the user is on the company house page
        When the user searches for a company
        And the user navigates to the next page

    Scenario: Organisation size
        Given the user is on the organisation size page
        When the user enters a valid employee details
        And the user navigates to the next page

    Scenario: Financial end year
        Given the user is on the financial end year page page
        When the user enters a valid financial end year details
            | Field    | Value   |
            | Month    | 01      |
            | Year     | 2026    |
            | Turnover | £200000 |
        Then the user navigates to the next page

    Scenario: Project location valid test
        Given the user is on the project location web page
        When the user enters a valid city and postcode
        And the user navigates to the next page

    Scenario: Add the first contact to an organisation
        Given the user is on the add person web page
        When the user enters a valid data:
            | Field | Value          |
            | fname | Lead IFSPA     |
            | lname | Leo Team       |
            | phone | 0761-999999999 |
            | email | ifs@ifspa.COM  |
        Then the user navigates to the summary page

    Scenario: Add Labour costs
        Given the user is on the spend profile page
        And the user navigates to the labour costs page
        When the user enters a valid labour cost below:
            | Field | Value    |
            | Role  | Lorem123 |
            | Gross | 100      |
            | Rate  | 1000     |
            | Days  | 100      |
        Then the total should be "£100,000.00"
        And the user clicks save and return to labour
        Then the cost total should be "£100,000.00"

    Scenario: Overhead Rate
        Given the user is on the spend profile page
        When the user navigate to the Overheads page
        Then the user selects calculated Overhead

    Scenario: Other funding
        Given the user is on the other public sector funding page
        When the user enters the following table data:
            | fund        | mm | yyyy | cost  |
            | Olu         | 01 | 2024 | £1000 |
            | Allan       | 02 | 2023 | 1500  |
            | Leo         | 03 | 2022 | 2000  |
            | Joe         | 04 | 2021 | 2500  |
            | Pallab      | 05 | 2020 | 10    |
            | Mark        | 06 | 2019 | 1.00  |
            | Siva        | 07 | 2018 | £1.00 |
            | Steven      | 08 | 2017 | 4500  |
            | Satish      | 09 | 2016 | 100   |
            | Naga        | 10 | 2015 | 100   |
            | Krish       | 11 | 2014 | 10    |
            | Richard     | 12 | 2013 | 10    |
            | Sri         | 05 | 2020 | 100   |
            | Kay         | 06 | 2019 | 1.00  |
            | Sandine     | 07 | 2018 | £1.00 |
            | Kemi        | 08 | 2017 | 40.99 |
            | Tony        | 09 | 2016 | 500   |
            | Chandra     | 10 | 2015 | 50.22 |
            | External UI | 11 | 2014 | 00    |
            | Salesforce  | 12 | 2013 | 100.0 |

        Then the total remaning fund should be "£12,525.21"
        When the user removes one line of funding
        Then the total remaning fund should be "£12,425.21"
        When the user navigates to the next page
        Then the funding level page should be displayed

    Scenario: Mark as complete
        Given the user is on the summary page
        Then the user clicks mark as complete

    Scenario: Give reasons to innoovate
        Given the user is on the pcr request details page
        When the user completes the reasons section

    Scenario: Add another partner
        Given the user is on the pcr request details page
        And the user sees the request details
        When the user clicks add type
        Then the user selects the newly created partner

    Scenario: Search for an organisation page
        Given the user searches for an organisation
        When the user navigates to the next page

    Scenario: Project location details
        Given the user is on the project location page
        When the user enters a valid city and postcode
        Then the user navigates to the next page

    Scenario: Project location
        Given the user is on the project location page
        When the user enters a valid city and postcode
        Then the user navigates to the next page

    Scenario: Add person to an organisation
        Given the user is on the add finance page
        And the user enters a valid data:
            | Field | Value             |
            | fname | Leo IFSPA         |
            | lname | IFSPA             |
            | phone | 0161-999999999    |
            | email | INVALID@ifspa.COM |
        Then the user navigates to the next page

    Scenario: Funding
        Given the user is on the Other public sector funding page
        When the user enters the following table data:
            | fund      | mm | yyyy | cost  |
            | dave      | 01 | 2024 | £1000 |
            | user      | 02 | 2023 | 500   |
            | the       | 03 | 2022 | 100   |
            | They      | 04 | 2021 | 2500  |
            | Other     | 05 | 2020 | 10    |
            | Then      | 06 | 2019 | 1.00  |
            | sector    | 07 | 2018 | £1.00 |
            | data      | 08 | 2017 | 3     |
            | Satish    | 09 | 2016 | 4     |
            | navigates | 10 | 2015 | 5     |
            | nav       | 11 | 2014 | 10    |
            | Test      | 12 | 2013 | 2     |
            | @         | 05 | 2020 | 100   |
            | £         | 06 | 2019 | 1.00  |
            | #         | 07 | 2018 | £1.00 |
            | &         | 08 | 2017 | 40.99 |
            | *         | 09 | 2016 | 500   |
            | Fruit     | 10 | 2015 | 50.22 |
            | UI        | 11 | 2014 | 1     |
            | force     | 12 | 2013 | 100.0 |

        And the user navigates to the next page
        Then the funding level page should be displayed
        And the user navigates to the summary page

    Scenario: Je-s doc page
        Given the user is on the Je-s document page
        When the user user uploads a valid document
        Then the user sees the document table
            | file_name | type      | date_uploaded | size  | uploaded_by     | action |
            | add.png   | Je-S Form | current date  | 177KB | Project Manager | Remove |
        And the user navigates to the next page

    Scenario: Je-s cost categories
        Given the user is on the Je-s cost categories page
        When the user enter the tsb reference "121AB"
        And the user navigates to the summary page
        When the user clicks mark as complete
        Then the user sees the pcr summary

    Scenario: Remove and reinstate funding
        Given the user is on the Other sources of funding? page
        When the user amends the details
        Then the user sees the funding section with the following details:
            | Key                             | Value       |
            | Project costs for new partner   | £102,000.00 |
            | Other sources of funding?       | No          |
            | Funding level                   | 80.00%      |
            | Funding sought                  | £71,659.83  |
            | Partner contribution to project | £17,914.96  |

        When the user navigates to the Other sources of funding? page followed by ammending the details
        Then the user sees the funding section with the following details:
            | Key                             | Value       |
            | Project costs for new partner   | £102,000.00 |
            | Other sources of funding?       | Yes         |
            | Funding from other sources      | £12,425.21  |
            | Funding level                   | 80.00%      |
            | Funding sought                  | £71,659.83  |
            | Partner contribution to project | £17,914.96  |
        When the user clicks mark as complete
        Then the user sees the pcr summary
        When the user clicks Submit request
        Then the project change request should be submitted.
        







