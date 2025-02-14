@mode:serial

Feature: Loan Drawdowns
    Scenario: Viewing drawdowns as a Project Manager
        Given a standard Loans project exists
        And the user is the "pmUser" user
        And the user is on the project overview
        When the user selects the "Drawdowns" tile
        Then the user will see the Drawdowns page
            | Drawdown | Drawdown amount |
            | 1        | £110,000        |
            | 2        | £121,000        |
            | 3        | £132,000        |
            | 4        | £143,000        |
            | 5        | £154,000        |
            | 6        | £165,000        |
            | 7        | £176,000        |
            | 8        | £187,000        |
            | 9        | £198,000        |
            | 10       | £209,000        |
            | 11       | £220,000        |
            | 12       | £231,000        |

        When the user clicks the View button
        Then the user will see the read-only drawdown

        When this user clicks the change drawdown link
        Then the user will see the PCR Start a new request page
