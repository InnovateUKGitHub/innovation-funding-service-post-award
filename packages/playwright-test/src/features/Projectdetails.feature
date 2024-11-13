@mode:serial
Feature: Project details
    Scenario: Reviewing the project details page
        Given a standard CR&D project exists
        And the user is a project manager
        And the user is on the project overview
        When the user selects the "Project details" tile
        Then Project details will be displayed with correct information

    Scenario: Updating the project location postcode
        Given a standard CR&D project exists
        And the user is a finance contact
        And the user has navigated to the project details page
        When the user clicks on the "Hedge's Consulting Ltd. (Lead)" partner name
        Then the partner information page is displayed

        When the user clicks the Edit button next to location
        Then the user can update the project location

        When the user returns to project details
        Then the new location is displayed on Partner information page

        When the user navigates back to Project details
        Then the new location is displayed on Project details page