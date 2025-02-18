@mode:serial
Feature: Loan Drawdown change
    Scenario: Creating and submitting a Loan Drawdown change PCR
        Given a standard Loans project exists
        And the user is the "pmUser" user
        And the user is on the project overview
        When the user selects the "Project change requests" tile
        Then the Loans PCR options are displayed

        When the user creates a "Loan drawdown change" PCR
        And the user completes the Loan Drawdown Change with validation
        Then the user will see the submitted page for "Loan Drawdown Change"

