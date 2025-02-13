@mode:serial
Feature: Add a partner

  Background:
    Given a standard CR&D project exists
    And the user is the "pmUser" user
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    Then the project change request page is displayed

  Scenario: Successfully add a new business partner
    Given the user sees the project request page
    When the user completes the request to add a partner
    And the user sees the summary table with the following details:
      | Key                                     | Value                                                              |
      | Project role                            | Collaborator                                                       |
      | Commercial or economic project outputs? | Yes                                                                |
      | Organisation type                       | Business                                                           |
      | Eligibility of aid declaration          | Not applicable                                                     |
      | Organisation name                       | MAN & CAVE LTD                                                     |
      | Registration number                     | 13598965                                                           |
      | Registered address                      | 13 Dymoke Green, St Albans, Hertfordshire, United Kingdom, AL4 9LX |
      | Size                                    | Medium                                                             |
      | Number of full time employees           | 10000                                                              |
      | End of financial year                   | December 2025                                                      |
      | Turnover                                | £1,000,000.00                                                      |
      | Project location                        | Inside the United Kingdom                                          |
      | Name of town or city                    | If you ever need a reason to go to the o                           |
      | Postcode                                | If you eve                                                         |

    And the user sees the contacts section with the following details:
      | Key          | Value                       |
      | First name   | Test                        |
      | Last name    | O'brien                     |
      | Phone number | 01618889999                 |
      | Email        | test'obrien@invalid.iuk.com |

    And the user sees the funding section with the following details:
      | Key                             | Value             |
      | Project costs for new partner   | £3,242,739,716.50 |
      | Other sources of funding?       | Yes               |
      | Funding from other sources      | £1,000.00         |
      | Funding level                   | 50.00%            |
      | Funding sought                  | £1,621,369,358.25 |
      | Partner contribution to project | £1,621,369,358.25 |

    And the user sees the agreement section with the following details:
      | Key               | Value          |
      | Partner agreement | Not applicable |
    When the user completes the reasons section
    And the user clicks Submit request
    Then the request should be submitted
    And the user sees the table below
      | request_number | types         | started         | status                          | last_updated    | action |
      | 1              | Add a partner | submission date | Submitted to Monitoring Officer | submission date | View   |

  Scenario: Research partner - verify that the user cannot submit the PCR without completing all the required details
    Given the user is the "pmUser" user
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    When the user selects add a partner
    And the user completes the new partner information page
    And the user navagigates to the summary page
    When the user attempts to mark the request as complete without completing the relevant fields
    Then the following validation errors should be displayed:
      | Enter organisation name.             |
      | Select project location.             |
      | Enter project city.                  |
      | Enter finance contact first name.    |
      | Enter finance contact last name.     |
      | Enter finance contact phone number.  |
      | Enter finance contact email address. |
      | Enter funding level.                 |
      | Enter TSB reference.                 |

  Scenario: Verify the non-aid page
    Given the user is on the non aid page
    When the user sees the non aid guidance text and navigates to the next page
    Then the Search for organisation should be displayed with an error message

  Scenario: Search for an organisation page
    Given the user searches for an organisation
    When the user navigates to the next page
    Then the Project location page should be displayed with an error message

  Scenario Outline: Project location invalid test
    Given the user is on the project location page
    When the user enters an invalid "<field>" data "<value>"
    And the user navigates to the next page
    Then the user sees error message "<error>"

    Examples:
      | field    | value                                      | error                                           |
      | City     | My cITyP0$TC@D£_12345678890/213A1@)0000000 | Project city must be 40 characters or less.     |
      | Postcode | My cITyP0$T!                               | Project postcode must be 10 characters or less. |

  Scenario: Project location valid test
    Given the user is on the project location page
    When the user enters a valid city and postcode
    And the user navigates to the next page
    Then the Add person to organisation page should be displayed

  Scenario: Add person to an organisation page
    Given the user is on the add person page
    When the user attempts to submit invalid data an error should be displayed
      | Field | Value                                                                                                                                                                                                                                                            | Expected Error                                                |
      | Fname | This information will be used to create an account /                                                                                                                                                                                                             | Finance contact first name must be 50 characters or less.     |
      | Lname | Finance contact first name must be 50 characters or less.                                                                                                                                                                                                        | Finance contact last name must be 50 characters or less.      |
      | Phone | Finance contact first                                                                                                                                                                                                                                            | Finance contact phone number must be 20 characters or less.   |
      | Email | We may use this to contact the partner for more information about this request.We may use this to contact the partner for more information about this request.We may use this to contact the partner for more information about this request.We may use this to9 | Finance contact email address must be 255 characters or less. |

    And the user enters a valid data:
      | Field | Value             |
      | fname | Leo IFSPA         |
      | lname | IFSPA             |
      | phone | 0161-999999999    |
      | email | INVALID@ifspa.COM |
    When the user navigates to the next page
    Then the Je-s document page should be displayed

  Scenario: Je-s doc page
    Given the user is on the Je-s document page
    When the user user uploads a valid document
    Then the user sees the document table
      | file_name | type      | date_uploaded | size  | uploaded_by     | action |
      | add.png   | Je-S Form | current date  | 177KB | Project Manager | Remove |
    When the user navigates to the next page
    Then the Je-s cost categories page should be displayed

  Scenario Outline: Je-s cost categories invalid test
    Given the user is on the Je-s cost categories page
    When the user validates each cost "<Field>" with an invalid data "<Value>"
    And the user navigates to the next page
    Then the user sees cost message "<Expected Error>"

    Examples:
      | Field                                      | Value         | Expected Error                            |
      | Directly incurred - Staff                  | -10           | Cost must be £0.00 or more.               |
      | Directly incurred - Travel and subsistence | a1@           | Cost must be a number.                    |
      | Directly incurred - Equipment              | $1299999      | Cost must be in pounds (£).               |
      | Directly incurred - Other costs            |               | Enter cost.                               |
      | Directly allocated - Investigations        | 9999999999990 | Cost must be £999,999,999,999.00 or less. |
      | Directly allocated - Estates costs         | £1000£        | Cost must be a valid currency.            |
      | Directly allocated - Other costs           | <tr>          | Cost must be a number.                    |
      | Indirect costs - Investigations            | 'OFFICE'      | Cost must be a number.                    |
      | Exceptions - Staff                         | 1.00000       | Cost must be 2 decimal places or fewer.   |
      | Exceptions - Travel and subsistence        | 11111@iuk     | Cost must be a valid currency.            |
      | Exceptions - Equipment                     | /\@£$%%^^&*   | Cost must be in pounds (£).               |
      | Exceptions - Other costs                   | 1.            | Cost must be a valid currency.            |
  # | Tsb reference                              | We may use this to contact the partner for more information about this request.We may use this to contact the partner for more information about this request.We may use this to contact the partner for more information about this request.We may use this to9 | TSB reference must be 256 characters or less. |
  # Enable the step above - ACC-11846

  Scenario: Je-s cost categories valid test
    Given the user is on the Je-s cost categories page
    When the user enters a valid jes costs
      | Field                                      | Value      |
      | Directly incurred - Staff                  | 1          |
      | Directly incurred - Travel and subsistence | 100        |
      | Directly incurred - Equipment              | 1000       |
      | Directly incurred - Other costs            | 20000      |
      | Directly allocated - Investigations        | 1000000000 |
      | Directly allocated - Estates costs         | £1000      |
      | Directly allocated - Other costs           | 100000.02  |
      | Indirect costs - Investigations            | 99999999   |
      | Exceptions - Staff                         | 1.00       |
      | Exceptions - Travel and subsistence        | 999        |
      | Exceptions - Equipment                     | 2          |
      | Exceptions - Other costs                   | 1          |
      | Tsb reference                              | Abc-257    |

    And the user navigates to the next page
    Then the Other public sector funding page should be displayed

  Scenario: Other funding page
    Given the user is on the Other public sector funding page
    When the user enters the following invalid funding data:
      | fund | mm  | yyyy | cost    |
      |      | -1  | -202 | -£1000  |
      |      | two | th   | hundred |
      |      |     |      |         |
      |      | 1   | 24   | $1      |
      |      | !@  | !@£$ | /#$     |
    And the user navigates to the next page
    Then the following validation errors should be displayed:
      | Funding amount must be £0.00 or more. |
      | Enter source of funding.              |
      | Date secured must be a date.          |
      | Funding amount must be a number.      |
      | Enter source of funding.              |
      | Date secured must be a date.          |
      | Enter funding amount.                 |
      | Enter source of funding.              |
      | Enter date secured.                   |
      | Funding amount must be in pounds (£). |
      | Enter source of funding.              |
      | Date secured must be a date.          |
      | Funding amount must be in pounds (£). |
      | Enter source of funding.              |
      | Date secured must be a date.          |

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
      | /Fund          | 12 | 2013 | 6500000 |

    And the user navigates to the next page
    Then the funding level page should be displayed

  Scenario: Agreement page
    Given the user is on the agreement page
    When the user uploads the agreement document
    And the user navigates to the next page
    Then the user sees the summary table with the following details:
      | Key                                     | Value                                    |
      | Project role                            | Collaborator                             |
      | Commercial or economic project outputs? | No                                       |
      | Organisation type                       | Research                                 |
      | Eligibility of aid declaration          | Not applicable                           |
      | Organisation name                       | Swindon University                       |
      | Size                                    | Academic                                 |
      | Project location                        | Inside the United Kingdom                |
      | Name of town or city                    | My name is IFSPA pre award and IFSPA pos |
      | Postcode                                | SN1 VPN                                  |

    And the user sees the contacts section with the following details:
      | Key          | Value             |
      | First name   | Leo IFSPA         |
      | Last name    | IFSPA             |
      | Phone number | 0161-999999999    |
      | Email        | INVALID@ifspa.COM |

    And the user sees the funding section with the following details:
      | Key                             | Value             |
      | Je-S form                       | add.png           |
      | TSB reference                   | Abc-257           |
      | Project costs for new partner   | £1,100,123,103.02 |
      | Other sources of funding?       | Yes               |
      | Funding from other sources      | £13,049,025.21    |
      | Funding level                   | 80.00%            |
      | Funding sought                  | £869,659,262.25   |
      | Partner contribution to project | £217,414,815.56   |

    And the user sees the agreement section with the following details:
      | Key               | Value   |
      | Partner agreement | add.png |


  Scenario: Verify other funding table remains constant, give reasons, and submit the request
    Given the user is on the Other public sector funding page
    And And the use verifies the table
    When the user completes the reasons section
    And the user clicks Submit request
    Then the request should be submitted.

  Scenario: The MO can review a PCR
    Given the user is the "mspUser" user
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    When the user selects specific PCR
    Then the user sees the summary table with the following details:
      | Key                                     | Value                                                              |
      | Project role                            | Collaborator                                                       |
      | Commercial or economic project outputs? | Yes                                                                |
      | Organisation type                       | Business                                                           |
      | Eligibility of aid declaration          | Not applicable                                                     |
      | Organisation name                       | MAN & CAVE LTD                                                     |
      | Registration number                     | 13598965                                                           |
      | Registered address                      | 13 Dymoke Green, St Albans, Hertfordshire, United Kingdom, AL4 9LX |
      | Size                                    | Medium                                                             |
      | Number of full time employees           | 10000                                                              |
      | End of financial year                   | December 2025                                                      |
      | Turnover                                | £1,000,000.00                                                      |
      | Project location                        | Inside the United Kingdom                                          |
      | Name of town or city                    | If you ever need a reason to go to the o                           |
      | Postcode                                | If you eve                                                         |

    And the user sees the contacts section with the following details:
      | Key          | Value                       |
      | First name   | Test                        |
      | Last name    | O'brien                     |
      | Phone number | 01618889999                 |
      | Email        | test'obrien@invalid.iuk.com |

    And the user sees the funding section with the following details:
      | Key                             | Value             |
      | Project costs for new partner   | £3,242,739,716.50 |
      | Other sources of funding?       | Yes               |
      | Funding from other sources      | £1,000.00         |
      | Funding level                   | 50.00%            |
      | Funding sought                  | £1,621,369,358.25 |
      | Partner contribution to project | £1,621,369,358.25 |

    And the user sees the agreement section displaying the following details:
      | Key               | Value          |
      | Partner agreement | Not applicable |

    When the user clicks view
    Then the user sees the cost category table below
      | Category               | Cost              |
      | Labour                 | £2,701,520,000.00 |
      | Overheads              | £540,304,000.00   |
      | Materials              | £510,300.00       |
      | Capital usage          | £316.50           |
      | Subcontracting         | £400,000.00       |
      | Travel and subsistence | £100.00           |
      | Other costs            | £0.00             |
      | Other costs 2          | £5,000.00         |
      | Other costs 3          | £0.00             |
      | Other costs 4          | £0.00             |
      | Other costs 5          | £0.00             |

    And the user views a cost category
    Then the user sees the cost table 
      | Role within project | Gross employee cost | Rate    | Days to be spent | Total cost      |
      | Lorem/tester        | £120,000.00         | £900.00 | 1000000          | £900,000,000.00 |
      | /tester             | £1,200.99           | £900.76 | 1000000          | £900,760,000.00 |
      | /tester             | £1,200.99           | £900.76 | 1000000          | £900,760,000.00 |

    When the user navigates back followed by submitting the request
    Then the request should be successfully submitted to Innovate
