Feature: Broadcast message
    The Project dashboard allows broadcasts from IUK to deliver important information to all users

    Scenario: The broadcasts message appears and can be clicked
        Given the user is on the projects dashboard
        And the user can see the broadcast banner
        When the user clicks the "Read more" link
        Then the user sees the broadcast page
        And the user sees the broadcast information

    Scenario: The broadcast screen displays correct information
        Given the user is on the broadcast page
        Then the user sees the broadcast information

    Scenario: The broadcast screen has a working backlink
        Given the user is on the broadcast page
        When the user clicks the "Back to Project" backlink
        Then the user sees the projects dashboard
