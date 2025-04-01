@mode:serial
Feature: Lead partner

  Background:
    Given a standard CR&D project exists
    And the user is the "pmUser" user
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    Then the project change request page is displayed

  Scenario: Lead partner
    Given the user is the "pmUser" user
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    When the user selects a partner
    And the user completes the lead partner information page
    And the user navigates to the summary page
    When the user attempts to mark the request as complete without completing the relevant fields
    Then the following validation errors should be displayed:
      | Enter organisation name.             |
      | Enter registration number.           |
      | Enter registered address.            |
      | Select participant size.             |
      | Enter number of employees.           |
      | Enter financial year end.            |
      | Enter financial year end turnover.   |
      | Select project location.             |
      | Enter project city.                  |
      | Enter finance contact first name.    |
      | Enter finance contact last name.     |
      | Enter finance contact phone number.  |
      | Enter finance contact email address. |
      | Enter project manager first name.    |
      | Enter project manager phone number.  |
      | Enter project manager last name.     |
      | Enter project manager email address. |
      | Enter funding level.                 |

  Scenario: Verify the non-aid page
    Given the user is on the non aid page
    When the user sees the non aid guidance text and navigates to the next page
    Then the Search for organisation should be displayed with an error message

  Scenario: Company house
    Given the user is on the company house page
    When the user attempts to submit an invalid company details an error should be displayed
      | Field                | Value     | Expected Error                                      |
      | Organisation_name    | 101 char  | Organisation name must be 100 characters or less.   |
      | Registration_number  | 41 char   | Registration number must be 40 characters or less.  |
      | Registration_address | 2001 char | Registered address must be 2000 characters or less. |
    When the user searches for a company
    And the user navigates to the next page
    Then the organisation size page should be displayed

  Scenario: Organisation size
    Given the user is on the organisation size page
    When the user attempts to submit an invalid number of employees
      | Field           | Value     | Expected Error                                   |
      | Number_employee | -         | Number of employees must be a number.            |
      | Number_employee | £!0000    | Number of employees must be a number.            |
      | Number_employee | 100000000 | Number of employees must be less than 100000000. |
      | Number_employee | abc       | Number of employees must be a number.            |
      | Number_employee | 123abc    | Number of employees must be a number.            |
    When the user enters a valid employee details
    And the user navigates to the next page
    Then the financial end year page should be displayed

  Scenario: Financial end year
    Given the user is on the financial end year page page
    When the user attempts to submit an invalid financial end year details
      | Field    | Value         | Expected Error                                                   |
      | Month    | abc           | Enter financial year end.                                        |
      | Year     | abc           | Enter financial year end.                                        |
      | Turnover | abc           | Financial year end turnover must be a number.                    |
      | Month    | o1            | Enter financial year end.                                        |
      | Year     | 2oo5          | Enter financial year end.                                        |
      | Turnover | 2oooooooo     | Financial year end turnover must be a valid currency.            |
      | Month    | -             | Enter financial year end.                                        |
      | Year     | £!0_000       | Enter financial year end.                                        |
      | Turnover | $             | Financial year end turnover must be in pounds (£).               |
      | Turnover | 1000000000000 | Financial year end turnover must be £999,999,999,999.00 or less. |
      | Month    | 111           | Enter financial year end.                                        |
      | Year     | 11111         | Enter financial year end.                                        |

    When the user enters a valid financial end year details
      | Field    | Value   |
      | Month    | 01      |
      | Year     | 2026    |
      | Turnover | £200000 |
    And the user navigates to the next page
    Then the project location page should be displayed

  Scenario: Project location valid test
    Given the user is on the project location web page
    When the user enters a valid city and postcode
    And the user navigates to the next page
    Then the Add person to organisation page should be displayed

  Scenario: Add the first contact to an organisation
    Given the user is on the add person web page
    When the user enters a valid data:
      | Field | Value          |
      | fname | Lead IFSPA     |
      | lname | Leo Team       |
      | phone | 0761-999999999 |
      | email | ifs@ifspa.COM  |
    And the user navigates to the summary page
    Then the user sees the contacts section with the following details:
      | Key          | Value          |
      | First name   | Lead IFSPA     |
      | Last name    | Leo Team       |
      | Phone number | 0761-999999999 |
      | Email        | ifs@ifspa.COM  |

  Scenario: Add the second contact to an organisation
    Given the user is on the PM contact page
    When the user enters a valid PM data:
      | Field | Value          |
      | fname | PM contact     |
      | lname | Rafa Team      |
      | phone | 999999999      |
      | email | pm@ifspa.co.uk |

    And the user navigates to the summary page
    Then the user sees the PM section with the following details:
      | Key          | Value          |
      | First name   | PM contact     |
      | Last name    | Rafa Team      |
      | Phone number | 999999999      |
      | Email        | pm@ifspa.co.uk |

  Scenario: Use the same details as the finance contact
    Given the user is on the PM contact page
    When the user clicks the same details as the finance contact
    And the user navigates to the summary page
    Then the user sees the contacts section with the following details:
      | Key          | Value          |
      | First name   | Lead IFSPA     |
      | Last name    | Leo Team       |
      | Phone number | 0761-999999999 |
      | Email        | ifs@ifspa.COM  |

  Scenario: Spend profile page
    Given the user is on the spend profile page
    And the user sees the spend profile table below
      | Category               | Cost  |
      | Labour                 | £0.00 |
      | Overheads              | £0.00 |
      | Materials              | £0.00 |
      | Capital usage          | £0.00 |
      | Subcontracting         | £0.00 |
      | Travel and subsistence | £0.00 |
      | Other costs            | £0.00 |
      | Other costs 2          | £0.00 |
      | Other costs 3          | £0.00 |
      | Other costs 4          | £0.00 |
      | Other costs 5          | £0.00 |

  Scenario Outline:  Invalid Labour cost test
    Given the user is on the spend profile page
    And the user navigates to the labour costs page
    When the user validates validates labour "<Field>" with an invalid data "<Value>"
    Then the user sees the following cost errors:

      | Expected Error |
      | <Error 1>      |
      | <Error 2>      |
      | <Error 3>      |
      | <Error 4>      |

    Examples:
      | Field | Value         | Error 1                                              | Error 2                                                 | Error 3                                           | Error 4                                        |
      | Role  | max char      | Role within project must be 1000 characters or less. | Gross cost of role must be a number.                    | Enter rate per day.                               | Enter days spent on project.                   |
      | Gross | abc           | Enter role within project.                           | Gross cost of role must be a number.                    | Enter rate per day.                               | Enter days spent on project.                   |
      | Rate  | abc           | Enter role within project.                           | Enter gross cost of role.                               | Rate per day must be a number.                    | Enter days spent on project.                   |
      | Days  | abc           | Enter role within project.                           | Enter gross cost of role.                               | Enter rate per day.                               | Days spent on project must be a number.        |
      | Gross | 1000000000000 | Enter role within project.                           | Gross cost of role must be £999,999,999,999.00 or less. | Enter rate per day.                               | Enter days spent on project.                   |
      | Rate  | 1000000000000 | Enter role within project.                           | Enter gross cost of role.                               | Rate per day must be £999,999,999,999.00 or less. | Enter days spent on project.                   |
      | Days  | 1000000000000 | Enter role within project.                           | Enter gross cost of role.                               | Enter rate per day.                               | Days spent on project must be 1000000 or less. |
      | Gross | $2            | Enter role within project.                           | Gross cost of role must be in pounds (£).               | Enter rate per day.                               | Enter days spent on project.                   |
      | Rate  | $2            | Enter role within project.                           | Enter gross cost of role.                               | Rate per day must be in pounds (£).               | Enter days spent on project.                   |
      | Days  | $2@           | Enter role within project.                           | Enter gross cost of role.                               | Enter rate per day.                               | Days spent on project must be a number.        |

  Scenario: ACC-11926: Page crashes when entering maximum acceptable values
    Given the user is on the spend profile page
    And the user navigates to the labour costs page
    When the user enters a valid labour cost below:
      | Field | Value        |
      | Role  | 1001_NewRole |
      | Gross | 100          |
      | Rate  | 100000000000 |
      | Days  | 1000000      |
    And the user clicks save and return to labour
    Then the following validation errors should be displayed:
      | Total cost must be less than £10,000,000,000,000,000.00. |
    And the total field level error must be "Total cost must be less than £10,000,000,000,000,000.00."

  Scenario: Add another cost
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
    And the user clicks add a cost
    When the user enters a valid labour cost below:
      | Field | Value   |
      | Role  | AaA#123 |
      | Gross | 100     |
      | Rate  | 1000    |
      | Days  | 363     |
    Then the total should be "£363,000.00"
    And the user clicks save and return to labour
    Then the cost total should be "£463,000.00"

  Scenario: Overhead Rate
    Given the user is on the spend profile page
    When the user navigate to the Overheads page
    Then the user completes the Overheads

  Scenario: Edit labour cost
    Given the user is on the spend profile page
    And the user navigates to the labour costs page
    And the user clicks edit
    When the user enters a valid labour cost below:
      | Field | Value |
      | Role  | AbCd  |
      | Gross | 10    |
      | Rate  | 10    |
      | Days  | 63    |
    And the user clicks save and return to labour
    When the user enters a valid labour cost below twenty times:
      | Field | Value |
      | Role  | #123  |
      | Gross | 100   |
      | Rate  | 100   |
      | Days  | 36    |
    When the user removes a cost
    Then the cost total should be "£169,030.00"
    And the user clicks save and return to project
    Then total cost categories should be "£202,836.00"

  Scenario: Materials page - ACC 11926
    Given the user is on the spend profile page
    And the user is on the materials page
    When the user enters the following materials costs 
      | Field    | Value        |
      | Item     | Test         |
      | Quantity | 999999       |
      | Cost     | 999999999999 |
    And the user clicks save and return to materials
    Then the following validation errors should be displayed:
      | Total cost must be less than £10,000,000,000,000,000.00. |
    And the total field level error must be "Total cost must be less than £10,000,000,000,000,000.00."

    And the user clicks back to materials
    When the user enters the following materials costs twenty times
      | Field    | Value   |
      | Item     | Ab_@ono |
      | Quantity | 10      |
      | Cost     | 1000    |
    Then the cost total should be "£200,000.00"
    And the user clicks save and return to project
    Then total cost categories should be "£402,836.00"

  Scenario Outline: Invalid capital usage test
    Given the user is on the spend profile page
    And the user navigates to the capital usage page
    When the user validates validates capital usage "<Field>" with an invalid data "<Value>"
    Then the user sees the following cost error:

      | Expected Error |
      | <Error 1>      |
      | <Error 2>      |
      | <Error 3>      |
      | <Error 4>      |
      | <Error 5>      |
      | <Error 6>      |

    Examples:
      | Field          | Value    | Error 1                 | Error 2                    | Error 3                               | Error 4                                  | Error 5                                           | Error 6                                        |
      | Description    | Test     | Select item type.       | Enter depreciation period. | Enter net present value.              | Enter residual value.                    | Enter utilisation.                                |                                                |
      | Select_type    | Existing | Enter item description. | Enter depreciation period. | Enter net present value.              | Enter residual value.                    | Enter utilisation.                                |                                                |
      | Depreciation   | -        | Select item type.       | Enter item description.    | Depreciation period must be a number. | Enter net present value.                 | Enter residual value.                             | Enter utilisation.                             |
      | Depreciation   | £!@£abc  | Select item type.       | Enter item description.    | Depreciation period must be a number. | Enter net present value.                 | Enter residual value.                             | Enter utilisation.                             |
      | Depreciation   | £!@£abc  | Select item type.       | Enter item description.    | Depreciation period must be a number. | Enter net present value.                 | Enter residual value.                             | Enter utilisation.                             |
      | Net_value      | -        | Select item type.       | Enter item description.    | Enter depreciation period.            | Net present value must be a number.      | Enter residual value.                             | Enter utilisation.                             |
      | Net_value      | $200     | Select item type.       | Enter item description.    | Enter depreciation period.            | Net present value must be in pounds (£). | Enter residual value.                             | Enter utilisation.                             |
      | Residual_value | -        | Select item type.       | Enter item description.    | Enter depreciation period.            | Enter net present value.                 | Residual value must be a number.                  | Enter utilisation.                             |
      | Residual_value | €200     | Select item type.       | Enter item description.    | Enter depreciation period.            | Enter net present value.                 | Residual value must be in pounds (£).             | Enter utilisation.                             |
      | Residual_value | 1.00000  | Select item type.       | Enter item description.    | Enter depreciation period.            | Enter net present value.                 | Residual value must be 2 decimal places or fewer. | Enter utilisation.                             |
      | Utilisation    | 1.00000  | Select item type.       | Enter item description.    | Enter depreciation period.            | Enter net present value.                 | Enter residual value.                             | Utilisation must be 2 decimal places or fewer. |
      | Utilisation    | TEN      | Select item type.       | Enter item description.    | Enter depreciation period.            | Enter net present value.                 | Enter residual value.                             | Utilisation must be a number.                  |


  Scenario: Valid capital usage test
    Given the user is on the capital usage page
    When the user enters the following Utilisation costs five times
      | Field          | Value    |
      | Description    | IUK#     |
      | Select_type    | New      |
      | Depreciation   | 36       |
      | Net_value      | £2000000 |
      | Residual_value | £20000   |
      | Utilisation    | 5        |
    Then the cost total should be "£495,000.00"

  Scenario: Subcontracting page
    Given the user is on the subcontracting page
    When the user enters the following subcontracting costs five times
      | Field                 | Value                  |
      | Description           | This is a new contract |
      | Subcontractor_name    | New Contract           |
      | Subcontractor_country | United Kingdom         |
      | Description           | This is a new contract |
      | Cost                  | £2000                  |
    Then the cost total should be "£10,000.00"

  Scenario: Travel and subsistence page
    Given the user is on the travel and subsistenc page
    When the user enters the following travel and subsistenc costs five times
      | Field           | Value        |
      | Description     | New Contract |
      | Number_of_times | 1            |
      | Cost            | £1000        |
    Then the cost total should be "£5,000.00"

  Scenario: Other cost page
    Given the user is on the other cost page
    When the user enters the following other costs four times
      | Field       | Value        |
      | Description | New Contract |
      | Estimate    | 1000         |
    Then the cost total should be "£4,000.00"

  Scenario: Other cost 2 page
    Given the user is on the other cost2 page
    When the user enters the following other cost2 three times
      | Field       | Value        |
      | Description | New Contract |
      | Estimate    | 1000         |
    Then the cost total should be "£3,000.00"

  Scenario: Other cost 3 page
    Given the user is on the other cost3 page
    When the user enters the following other cost3 four times
      | Field       | Value        |
      | Description | New Contract |
      | Estimate    | 1000         |
    Then the cost total should be "£4,000.00"

  Scenario: Other cost 4 page
    Given the user is on the other cost4 page
    When the user enters the following other cost4 four times
      | Field       | Value        |
      | Description | New Contract |
      | Estimate    | 1000         |
    Then the cost total should be "£4,000.00"

  Scenario: Other cost 5 page
    Given the user is on the other cost5 page
    When the user enters the following other cost5 four times
      | Field       | Value        |
      | Description | New Contract |
      | Estimate    | 1000         |
    Then the cost total should be "£4,000.00"
    And the user clicks save and return to project
    And the user sees the spend profile below
      | Category               | Cost        |
      | Labour                 | £169,030.00 |
      | Overheads              | £33,806.00  |
      | Materials              | £200,000.00 |
      | Capital usage          | £495,000.00 |
      | Subcontracting         | £10,000.00  |
      | Travel and subsistence | £5,000.00   |
      | Other costs            | £4,000.00   |
      | Other costs 2          | £3,000.00   |
      | Other costs 3          | £4,000.00   |
      | Other costs 4          | £4,000.00   |
      | Other costs 5          | £4,000.00   |

  Scenario: Other funding page
    Given the user is on the other public sector funding page
    When the user enters the following table data:
      | fund           | mm | yyyy | cost    |
      | RAFA Funds     | 01 | 2024 | £1000   |
      | ifspa funds    | 02 | 2023 | 1500    |
      | c FuNd 1 C     | 03 | 2022 | 2000    |
      | #20 funds      | 04 | 2021 | 2500    |
      | 1_2_3_4_ Funds | 05 | 2020 | 10      |
      | A_B_C_D_E      | 06 | 2019 | 1.00    |
      | CR&D Funda     | 07 | 2018 | £1.00   |
      | KTP            | 08 | 2017 | 4500    |
      | Horizon Europe | 09 | 2016 | 5000    |
      | !@£$%^&*       | 10 | 2015 | 5500    |
      | Fund_IFSPA     | 11 | 2014 | 6000    |
      | 124/Fund       | 12 | 2013 | 6500000 |
      | 1_2_3_ Funds   | 05 | 2020 | 10      |
      | A__C_D_E       | 06 | 2019 | 1.00    |
      | R&D Funda      | 07 | 2018 | £1.00   |
      | TP             | 08 | 2017 | 4500.99 |
      | Europe         | 09 | 2016 | 5000    |
      | !£$%^&*        | 10 | 2015 | 5500.22 |
      | _IFSPA         | 11 | 2014 | 6000    |
      | F              | 12 | 2013 | 0000    |

    And the user navigates to the next page
    Then the funding level page should be displayed

  Scenario: Agreement page
    Given the sees the agreement page
    When the user uploads the agreement document
    And the user navigates to the next page
    Then the user clicks mark as complete

  Scenario: Give reasons to innoovate
    Given the user is on the pcr request details page
    When the user completes the reasons section
    And the user clicks Submit request
    Then the project change request should be submitted.



