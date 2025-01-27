@mode:serial
Feature: KTP Project details

    Scenario: Reviewing the project details page as FC on KTP project
        Given a multi-partner KTP project exists
        And the user is the "mainFcUser" user
        And the user is on the project overview
        When the user selects the "Project details" tile
        Then "KTP" Project details will be displayed with correct information for "Finance Contact"

    Scenario: Reviewing the project details page as PM on KTP project
        Given a multi-partner KTP project exists
        And the user is the "pmUser" user
        And the user is on the project overview
        When the user selects the "Project details" tile
        Then "KTP" Project details will be displayed with correct information for "Project Manager"

        When the user clicks the Manage team members hyperlink
        Then the user will be taken to the Manage team members page