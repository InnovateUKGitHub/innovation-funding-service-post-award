@mode:serial
Feature: CR&D Project details
    Scenario: Reviewing the project details page as FC
        Given a multi-partner CR&D project exists
        And the user is the "mainFcUser" user
        And the user is on the project overview
        When the user selects the "Project details" tile
        Then "CR&D" Project details will be displayed with correct information for "Finance Contact"

    Scenario: Reviewing the project details page as PM on CR&D project
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        And the user is on the project overview
        When the user selects the "Project details" tile
        Then "CR&D" Project details will be displayed with correct information for "Project Manager"

        When the user clicks the Manage team members hyperlink
        Then the user will be taken to the Manage team members page

    Scenario: Updating the project location postcode
        Given a multi-partner CR&D project exists
        And the user is the "mainFcUser" user
        And the user has navigated to the project details page
        When the user clicks on the "Hedge's Primary Ltd. (Lead)" partner name
        Then the partner information page is displayed

        When the user clicks the Edit button next to location
        Then the user can update the project location

        When the user returns to project details
        Then the new location is displayed on Partner information page

        When the user navigates back to Project details
        Then the new location is displayed on Project details page

    Scenario: Validating the postcode box in Partner information
        Given a multi-partner CR&D project exists
        And the user is the "mainFcUser" user
        And the user has navigated to "Hedge's Primary Ltd. (Lead)" Partner information
        When the user exceeds 10 characters in the postcode field
        Then the postcode character limit is validated
