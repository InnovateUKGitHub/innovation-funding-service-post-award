@mode:serial

Feature: Loan Drawdowns
    Scenario: Viewing drawdowns as a Project Manager
        Given a standard Loans project exists
        And the user is the "pmUser" user
        And the user is on the project overview
        When the user selects the "Drawdowns" tile
        Then the user will see the "PM" Drawdowns page
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
        Then the user will see the "PM" drawdown
        When this user clicks the change drawdown link
        Then the user will see the PCR Start a new request page

    Scenario: Submitting a drawdown as a Finance Contact
        Given a standard Loans project exists
        And the user is the "mainFcUser" user
        And the user is on the project overview
        When the user selects the "Drawdowns" tile
        Then the user will see the "FC" Drawdowns page
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

        When the user clicks the Request button
        Then the user will see the "FC" drawdown

        When the user attempts to submit the Drawdown without a document and too many comments
        Then the user will see Drawdown validation messaging
            | Message                                                                  |
            | The request is only accepted when at least 1 document has been uploaded. |
            | Comments must be between 5 and 32768 characters.                         |

        When the enters 4 characters only and attempts to submit
        Then the user will see Drawdown validation messaging
            | Message                                                                  |
            | The request is only accepted when at least 1 document has been uploaded. |
            | Comments must be between 5 and 32768 characters.                         |

        When the user uploads a document and enters 5 characters
        Then the Drawdown validation messages will no longer appear

        When the user submits the Drawdown request
        Then the period 1 Drawdown status will be "Requested"
        And the Drawdown request button will be disabled

    Scenario: Approving Drawdown in Salesforce
        Given the internal user is on the project flexipage
        When the Salesforce user access the Drawdown
        And the user submits the Drawdown for approval
        Then the Salesforce status will show Approved

    Scenario: Accessing the Drawdowns once Drawdown 1 is approved
        Given a standard Loans project exists
        And the user is the "mainFcUser" user
        And the user is on the project overview
        When the user selects the "Drawdowns" tile
        Then the period 1 Drawdown status will be "Approved"
        And the user can access the second Drawdown

#Future additions: Add Manual project setup steps (button change).

