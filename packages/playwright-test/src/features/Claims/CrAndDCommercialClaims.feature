@mode:serial

Feature: CR&D Claims

    Scenario: Accessing a claim in Draft
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mainFcUser" user
        And the FC is on the Claims dashboard
            | Period    | Forecast costs for period | Actual costs for period | Difference    | Status | Date of last update |
            | Period 1: | £1,020,000.00             | £0.00                   | £1,020,000.00 | Draft  | 2025                |

        When the user clicks "Edit" on the claim line
        Then the user will see the Costs to be claimed page
            | Category               | Total eligible costs | Eligible costs claimed to date | Costs claimed this period | Remaining eligible costs |
            | Labour                 | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Overheads              | £1,560,000.00        | £0.00                          | £0.00                     | £1,560,000.00            |
            | Materials              | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Capital usage          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Subcontracting         | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Travel and subsistence | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs            | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 2          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 3          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 4          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 5          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Total                  | £79,560,000.00       | £0.00                          | £0.00                     | £79,560,000.00           |

    Scenario: Updating Claim cost categories
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mainFcUser" user
        And the user has accessed the Costs to be claimed page
        When the user clicks the "Labour" cost category
        Then the "Labour" "Business" costs page is displayed

        When the user adds "Business" line items for "Labour"
        And uploads evidence for "Labour"
        Then the user will see the Costs to be claimed page
            | Category               | Total eligible costs | Eligible costs claimed to date | Costs claimed this period | Remaining eligible costs |
            | Labour                 | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Overheads              | £1,560,000.00        | £0.00                          | £333.25                   | £1,559,666.75            |
            | Materials              | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Capital usage          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Subcontracting         | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Travel and subsistence | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs            | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 2          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 3          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 4          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 5          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Total                  | £79,560,000.00       | £0.00                          | £1,999.48                 | £79,558,000.52           |

        When the user updates the remaining "Business" cost categories
            | Category               |
            | Materials              |
            | Capital usage          |
            | Subcontracting         |
            | Travel and subsistence |
            | Other costs            |
            | Other costs 2          |
            | Other costs 3          |
            | Other costs 4          |
            | Other costs 5          |

        Then the user will see the Costs to be claimed page
            | Category               | Total eligible costs | Eligible costs claimed to date | Costs claimed this period | Remaining eligible costs |
            | Labour                 | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Overheads              | £1,560,000.00        | £0.00                          | £333.25                   | £1,559,666.75            |
            | Materials              | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Capital usage          | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Subcontracting         | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Travel and subsistence | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Other costs            | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Other costs 2          | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Other costs 3          | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Other costs 4          | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Other costs 5          | £7,800,000.00        | £0.00                          | £1,666.23                 | £7,798,333.77            |
            | Total                  | £79,560,000.00       | £0.00                          | £16,995.55                | £79,543,004.45           |

    Scenario: Viewing the Claims documents page
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mainFcUser" user
        And the user has accessed the Costs to be claimed page
        When the user accesses the Claim documents page
        Then the user will see the Claim documents page

    Scenario: Validating and updating the forecast page
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mainFcUser" user
        And the user has accessed the Update forecast page
        When the user enters invalid information into the "Claim" forecast
        Then the user will be advised of correct entries

        When the user updates and saves the Claims forecast table
            | Category               | Row number |
            | Labour                 | 1          |
            | Materials              | 3          |
            | Capital usage          | 4          |
            | Subcontracting         | 5          |
            | Travel and subsistence | 6          |
            | Other costs            | 7          |
            | Other costs 2          | 8          |
            | Other costs 3          | 9          |
            | Other costs 4          | 10         |
            | Other costs 5          | 11         |

        Then the "Claim" figures accurately reflect the changes
            | Category               | Row number |
            | Labour                 | 1          |
            | Materials              | 3          |
            | Capital usage          | 4          |
            | Subcontracting         | 5          |
            | Travel and subsistence | 6          |
            | Other costs            | 7          |
            | Other costs 2          | 8          |
            | Other costs 3          | 9          |
            | Other costs 4          | 10         |
            | Other costs 5          | 11         |

    Scenario: Proceeding to Claim summary
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mainFcUser" user
        And the user has accessed the Update forecast page
        When the user clicks Continue to summary
        Then the user will see the Claim summary page
            | File name     | Type           |
            | T.doc         | Invoice        |
            | testfile.xps  | Claim evidence |
            | testfile.xlsx | Claim evidence |
            | testfile.txt  | Claim evidence |
            | testfile.rtf  | Claim evidence |
            | testfile.ppt  | Claim evidence |
            | testfile.pdf  | Claim evidence |
            | testfile.odt  | Claim evidence |
            | testfile.odp  | Claim evidence |
            | testfile.csv  | Claim evidence |
            | testfile.doc  | Claim evidence |

    Scenario: Validating Claim summary page and checking links
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mainFcUser" user
        And the user has accessed the Claim summary page
        When the user attempts to submit the claim
        Then an IAR validation message is displayed

        When the user enters over 1000 characters in the Comments box
        Then the user will see a validation message advising of character limit


        When the user clicks the different links on the Summary page
            | Link                     | Page heading        |
            | Edit costs to be claimed | Costs to be claimed |
            | Edit claim documents     | Claim documents     |
            | Edit forecast            | Update forecast     |
            | Back to update forecast  | Update forecast     |
        Then the correct page heading will be displayed

    Scenario: Uploading an IAR and submitting the claim
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mainFcUser" user
        And the user has accessed the claim documents page
        When the user uploads an Independent Accountant's Report
        And the user submits the Claim
        Then the claim will have the status "Submitted to Monitoring Officer"

    Scenario: Reviewing and submitting a claim as Monitoring Officer
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mspUser" user
        And the MSP is on the Claims dashboard
            | Partner              | Forecast costs for period | Actual costs for period | Difference    | Status                          | Date of last update |
            | Hedge's Primary Ltd. | £1,020,000.00             | £16,995.55              | £1,003,004.45 | Submitted to Monitoring Officer | 2025                |
        When the user clicks "Review" on the claim line
        Then the user will see the Costs claimed
            | Category               | Forecast for period | Costs claimed this period | Difference £  | Difference % |
            | Labour                 | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Overheads              | £20,000.00          | £333.25                   | £19,666.75    | -98.33%      |
            | Materials              | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Capital usage          | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Subcontracting         | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Travel and subsistence | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Other costs            | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Other costs 2          | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Other costs 3          | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Other costs 4          | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Other costs 5          | £100,000.00         | £1,666.23                 | £98,333.77    | -98.33%      |
            | Total                  | £1,020,000.00       | £16,995.55                | £1,003,004.45 | -98.33%      |

        When the user clicks the "Forecast" accordion
        Then the user can see the view-only Forecast table
            | Category               | Row number |
            | Labour                 | 1          |
            | Materials              | 3          |
            | Capital usage          | 4          |
            | Subcontracting         | 5          |
            | Travel and subsistence | 6          |
            | Other costs            | 7          |
            | Other costs 2          | 8          |
            | Other costs 3          | 9          |
            | Other costs 4          | 10         |
            | Other costs 5          | 11         |

        When the user clicks the "Status and comments log" accordion
        Then the user can see the status log

        When the user clicks the "Supporting documents" accordion
        Then the user can see the MO documents table
            | File name     | Type                            |
            | MoDoc.doc     | Statement of expenditure        |
            | IAR.doc       | Independent accountant’s report |
            | T.doc         | Invoice                         |
            | testfile.xps  | Claim evidence                  |
            | testfile.xlsx | Claim evidence                  |
            | testfile.txt  | Claim evidence                  |
            | testfile.rtf  | Claim evidence                  |
            | testfile.ppt  | Claim evidence                  |
            | testfile.pdf  | Claim evidence                  |
            | testfile.odt  | Claim evidence                  |
            | testfile.odp  | Claim evidence                  |
            | testfile.csv  | Claim evidence                  |
            | testfile.doc  | Claim evidence                  |

        When the user selects the "Submit for approval" option
        And submits the claim to Innovate UK
        Then the claim will have the status "Submitted to Innovate UK"