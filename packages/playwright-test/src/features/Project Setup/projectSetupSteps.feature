@mode:serial

Feature: Project setup individual steps

    Scenario: Updating and validating the spend profile
        Given a multi-partner CR&D project exists in Project setup state
        And the user is the "mainFcUser" user
        When the user navigates to the Project Setup page
        Then the user will see the initial "editable" Project setup page

        When the user clicks the "Complete project setup" button
        Then the page will advise the user to complete all sections
            | section                                | message                                          |
            | Set spend profile                      | You must complete your spend profile.            |
            | Provide your bank details              | You must provide your bank details.              |
            | Provide your project location postcode | You must provide your project location postcode. |

        When the user clicks the "Set spend profile" list item
        Then the Spend profile page is displayed
            | Category               | Total eligible | Difference |
            | Labour                 | £7,800,000.00  | -100.00%   |
            | Overheads              | £1,560,000.00  | -100.00%   |
            | Materials              | £7,800,000.00  | -100.00%   |
            | Capital usage          | £7,800,000.00  | -100.00%   |
            | Subcontracting         | £7,800,000.00  | -100.00%   |
            | Travel and subsistence | £7,800,000.00  | -100.00%   |
            | Other costs            | £7,800,000.00  | -100.00%   |
            | Other costs 2          | £7,800,000.00  | -100.00%   |
            | Other costs 3          | £7,800,000.00  | -100.00%   |
            | Other costs 4          | £7,800,000.00  | -100.00%   |
            | Other costs 5          | £7,800,000.00  | -100.00%   |

        When the user "checks" Ready to submit
        And the user Clicks Save and return to project setup
        Then the user will see the following validation messages
            | Message                                                                                      |
            | The total forecasts for labour must be the same as the total eligible costs.                 |
            | The total forecasts for materials must be the same as the total eligible costs.              |
            | The total forecasts for capital usage must be the same as the total eligible costs.          |
            | The total forecasts for subcontracting must be the same as the total eligible costs.         |
            | The total forecasts for travel and subsistence must be the same as the total eligible costs. |
            | The total forecasts for other costs must be the same as the total eligible costs.            |
            | The total forecasts for other costs 2 must be the same as the total eligible costs.          |
            | The total forecasts for other costs 3 must be the same as the total eligible costs.          |
            | The total forecasts for other costs 4 must be the same as the total eligible costs.          |
            | The total forecasts for other costs 5 must be the same as the total eligible costs.          |

        When the user updates the spend profile equally
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

        Then the totals should calculate correctly
            | Total         | Difference |
            | £7,800,000.00 | 0.00%      |
            | £1,560,000.00 | 0.00%      |
            | £7,800,000.00 | 0.00%      |
            | £7,800,000.00 | 0.00%      |
            | £7,800,000.00 | 0.00%      |
            | £7,800,000.00 | 0.00%      |
            | £7,800,000.00 | 0.00%      |
            | £7,800,000.00 | 0.00%      |
            | £7,800,000.00 | 0.00%      |
            | £7,800,000.00 | 0.00%      |
            | £7,800,000.00 | 0.00%      |
        And the validation messages will dynamically disappear

        When the user clears the contents of a cell
        Then a validation message appears advising them to enter a value

        When the user reconciles the empty cells
        Then the validation messages will dynamically disappear

        When the user Clicks Save and return to project setup
        Then the "Set spend profile" section will show as "Complete"

        When the user clicks the "Set spend profile" list item
        And  the user "unchecks" Ready to submit
        And the user Clicks Save and return to project setup
        Then the "Set spend profile" section will show as "Incomplete"

        When the user clicks the "Set spend profile" list item
        And the user exceeds their total eligible costs
        And the user "checks" Ready to submit
        And the user Clicks Save and return to project setup
        Then the user will see the following validation messages
            | Message                                                                                      |
            | The total forecasts for labour must be the same as the total eligible costs.                 |
            | The total forecasts for materials must be the same as the total eligible costs.              |
            | The total forecasts for capital usage must be the same as the total eligible costs.          |
            | The total forecasts for subcontracting must be the same as the total eligible costs.         |
            | The total forecasts for travel and subsistence must be the same as the total eligible costs. |
            | The total forecasts for other costs must be the same as the total eligible costs.            |
            | The total forecasts for other costs 2 must be the same as the total eligible costs.          |
            | The total forecasts for other costs 3 must be the same as the total eligible costs.          |
            | The total forecasts for other costs 4 must be the same as the total eligible costs.          |
            | The total forecasts for other costs 5 must be the same as the total eligible costs.          |

        When the user exceeds the character limit of a cell
        Then the user will see the following validation messages
            | Message                                       |
            | Forecast must be £999,999,999,999.00 or less. |

        When the user updates the spend profile equally
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
        Then the validation messages will dynamically disappear

        When the user updates the table using decimals
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
        Then the totals should calculate correctly
            | Total         | Difference |
            | £7,915,992.24 | 1.49%      |
            | £1,583,198.40 | 1.49%      |
            | £7,915,992.24 | 1.49%      |
            | £7,915,992.24 | 1.49%      |
            | £7,915,992.24 | 1.49%      |
            | £7,915,992.24 | 1.49%      |
            | £7,915,992.24 | 1.49%      |
            | £7,915,992.24 | 1.49%      |
            | £7,915,992.24 | 1.49%      |
            | £7,915,992.24 | 1.49%      |
            | £7,915,992.24 | 1.49%      |

        When the user updates the spend profile equally
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
        And the user Clicks Save and return to project setup
        Then the "Set spend profile" section will show as "Complete"

    Scenario: Navigating to bank details page
        Given a multi-partner CR&D project exists in Project setup state
        And the user is the "mainFcUser" user
        When the user navigates to the Project Setup page
        And the user clicks the "Provide your bank details" list item
        Then the user will see the Provide your bank details page

        When the user clicks the "Submit bank details" button
        Then the user will see the following validation messages
            | Message                         |
            | Sort code cannot be empty.      |
            | Account number cannot be empty. |

    Scenario Outline: Validating bank details
        Given a multi-partner CR&D project exists in Project setup state
        And the user is the "mainFcUser" user
        When the user navigates to the Project Setup page
        And the user clicks the "Provide your bank details" list item
        When the user enters an invalid value "<Value>" in the banking field "<Field>"
        Then the user sees the validation message "<Message>"

        Examples:
            | Value     | Field          | Message                       |
            | %         | Sort code      | Enter a valid sort code.      |
            | *         | Sort code      | Enter a valid sort code.      |
            | lorem     | Sort code      | Enter a valid sort code.      |
            | 1111111   | Sort code      | Enter a valid sort code.      |
            | 1111      | Sort code      | Enter a valid sort code.      |
            | %         | Account number | Enter a valid account number. |
            | *         | Account number | Enter a valid account number. |
            | lorem     | Account number | Enter a valid account number. |
            | 1111      | Account number | Enter a valid account number. |
            | 111111111 | Account number | Enter a valid account number. |

    Scenario Outline: Validating address details
        Given a multi-partner CR&D project exists in Project setup state
        And the user is the "mainFcUser" user
        When the user navigates to the Project Setup page
        And the user clicks the "Provide your bank details" list item
        When the user enters "<Length>" characters in the "<Field>" field
        Then the user sees the validation message "<Message>"

        Examples:
            | Length | Field          | Message                                        |
            | 256    | Company number | Company number must be 255 characters or less. |
            | 256    | Building       | Building must be 255 characters or less.       |
            | 256    | Street         | Street must be 255 characters or less.         |
            | 256    | Locality       | Locality must be 255 characters or less.       |
            | 256    | Town or city   | Town or city must be 255 characters or less.   |
            | 256    | Postcode       | Postcode must be 255 characters or less.       |
            | 32000  | Company number | Company number must be 255 characters or less. |
            | 32000  | Building       | Building must be 255 characters or less.       |
            | 32000  | Street         | Street must be 255 characters or less.         |
            | 32000  | Locality       | Locality must be 255 characters or less.       |
            | 32000  | Town or city   | Town or city must be 255 characters or less.   |
            | 32000  | Postcode       | Postcode must be 255 characters or less.       |

    Scenario: Validating correct syntax account details with invalid data
        Given a multi-partner CR&D project exists in Project setup state
        And the user is the "mainFcUser" user
        When the user navigates to the Project Setup page
        And the user clicks the "Provide your bank details" list item
        When the user enters correct syntax account details with invalid data
        And the user clicks the "Submit bank details" button
        Then the user will see the following validation messages
            | Message                                  |
            | Check your sort code and account number. |

    Scenario: Boundary of character length is allowed
        Given a multi-partner CR&D project exists in Project setup state
        And the user is the "mainFcUser" user
        When the user navigates to the Project Setup page
        And the user clicks the "Provide your bank details" list item
        When the user completes the address fields with 255 characters
            | Field          | Length |
            | Company number | 255    |
            | Building       | 255    |
            | Street         | 255    |
            | Locality       | 255    |
            | Town or city   | 255    |
            | Postcode       | 255    |
        And the user clicks the "Submit bank details" button
        Then the following validation messages will not be present
            | Message                                        |
            | Company number must be 255 characters or less. |
            | Building must be 255 characters or less.       |
            | Street must be 255 characters or less.         |
            | Locality must be 255 characters or less.       |
            | Town or city must be 255 characters or less.   |
            | Postcode must be 255 characters or less.       |

    Scenario: Submitting valid bank details
        Given a multi-partner CR&D project exists in Project setup state
        And the user is the "mainFcUser" user
        When the user navigates to the Project Setup page
        And the user clicks the "Provide your bank details" list item
        When the user completes the Provide your bank details section
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

        When the user clicks the "Submit bank details" button
        Then the We need more information page is displayed

        When the user clicks the "Return to set up your project" button
        Then the "Provide your bank details" section will show as "Incomplete"

        When the user clicks the "Provide your bank details" list item
        Then the user will see the Upload bank statement page

        When the user user uploads a bank statement file
        And the user clicks the "Submit bank statement" button
        Then the "Provide your bank details" section will show as "Complete"

    Scenario: Validating and saving project location postcode
        Given a multi-partner CR&D project exists in Project setup state
        And the user is the "mainFcUser" user
        When the user navigates to the Project Setup page
        And the user clicks the "Provide your project location postcode" list item
        Then the user will see the Provide your project location postcode page

        When the user enters over 10 characters in the Postcode box
        Then the user will see the following validation messages
            | Message                                                  |
            | Project location postcode must be 10 characters or less. |

        When the user enters 10 characters
        And the user clicks the "Save and return to project setup" button
        Then the validation messages will dynamically disappear
        And the "Provide your project location postcode" section will show as "Complete"



#TODO:
# submission
# checking back end for partner status change.










