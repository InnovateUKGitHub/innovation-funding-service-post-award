@mode:serial
Feature: CR&D Academic claims
    Scenario: CR&D Academic claims journey
        Given a multi-partner CR&D project with profiles exists
        And the user is the "secondaryFcUser" user
        And the FC is on the Claims dashboard
            | Period    | Forecast costs for period | Actual costs for period | Difference    | Status | Date of last update |
            | Period 1: | £1,020,000.00             | £0.00                   | £1,020,000.00 | Draft  | 2025                |
        When the user clicks "Edit" on the claim line
        Then the user will see the Costs to be claimed page
            | Category                                   | Total eligible costs | Eligible costs claimed to date | Costs claimed this period | Remaining eligible costs |
            | Directly incurred - Staff                  | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Directly incurred - Travel and subsistence | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Directly incurred - Equipment              | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Directly incurred - Other costs            | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Directly allocated - Investigations        | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Directly allocated - Estates costs         | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Directly allocated - Other costs           | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Indirect costs - Investigations            | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Exceptions - Staff                         | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Exceptions - Travel and subsistence        | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Exceptions - Equipment                     | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Exceptions - Other costs                   | £1,200.00            | £0.00                          | £0.00                     | £1,200.00                |
            | Total                                      | £14,400.00           | £0.00                          | £0.00                     | £14,400.00               |

        When the user updates the remaining "Academic" cost categories
            | Category                                   |
            | Directly incurred - Staff                  |
            | Directly incurred - Travel and subsistence |
            | Directly incurred - Equipment              |
            | Directly incurred - Other costs            |
            | Directly allocated - Investigations        |
            | Directly allocated - Estates costs         |
            | Directly allocated - Other costs           |
            | Indirect costs - Investigations            |
            | Exceptions - Staff                         |
            | Exceptions - Travel and subsistence        |
            | Exceptions - Equipment                     |
            | Exceptions - Other costs                   |

        Then the user will see the Costs to be claimed page
            | Category                                   | Total eligible costs | Eligible costs claimed to date | Costs claimed this period | Remaining eligible costs |
            | Directly incurred - Staff                  | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Directly incurred - Travel and subsistence | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Directly incurred - Equipment              | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Directly incurred - Other costs            | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Directly allocated - Investigations        | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Directly allocated - Estates costs         | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Directly allocated - Other costs           | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Indirect costs - Investigations            | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Exceptions - Staff                         | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Exceptions - Travel and subsistence        | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Exceptions - Equipment                     | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Exceptions - Other costs                   | £1,200.00            | £0.00                          | £666.03                   | £533.97                  |
            | Total                                      | £14,400.00           | £0.00                          | £7,992.36                 | £6,407.64                |

        When the user completes their Forecast
            | Category                                   | Row number |
            | Directly incurred - Staff                  | 1          |
            | Directly incurred - Travel and subsistence | 2          |
            | Directly incurred - Equipment              | 3          |
            | Directly incurred - Other costs            | 4          |
            | Directly allocated - Investigations        | 5          |
            | Directly allocated - Estates costs         | 6          |
            | Directly allocated - Other costs           | 7          |
            | Indirect costs - Investigations            | 8          |
            | Exceptions - Staff                         | 9          |
            | Exceptions - Travel and subsistence        | 10         |
            | Exceptions - Equipment                     | 11         |
            | Exceptions - Other costs                   | 12         |

        And the user submits the Academic claim
        Then the claim will have the status "Submitted to Monitoring Officer"