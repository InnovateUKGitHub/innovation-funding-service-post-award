@mode:serial
Feature: Add a partner

  Background:
    Given a standard CR&D project exists
    And the user is the "pmUser" user
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    Then the project change request page is displayed

  # Ensures the app behaves correctly after errors are corrected
  # High level test

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

  Scenario: Reasearch partner - verify that the user cannot submit the PCR without completing all the required details
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

  Scenario: Search for organisation page
    Given the user searches for an organisation
    When the user navigates to the next page
    Then the Project location page should be displayed with an error message

  Scenario Outline: Project location invalid test
    Given the user is on the project location page
    When the user enters an invalid "<field>" data "<value>"
    And the user navigates to the next page
    Then the user sees error message "<error>"

    Examples:
      | field    | value                                     | error                                           |
      | City     | MycITyP0$TC@D£_12345678890/213A1@)0000000 | Project city must be 40 characters or less.     |
      | Postcode | MycITyP0$T!                               | Project postcode must be 10 characters or less. |

  Scenario: Project location valid test
    Given the user is on the project location page
    When the user enters a valid city and postcode 
    And the user navigates to the next page
    Then the Add person to organisation page should be displayed

  #Todo Add person to organisation

  #Todo Jes

  #Other public sector funding?






