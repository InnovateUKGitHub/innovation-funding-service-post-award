Feature: Broadcast message
    The Project dashboard allows broadcasts from IUK to deliver important information to all users

    Background: The user is on the projects dashboard
        Given the user is on the projects dashboard
        Then the user sees the "Dashboard" page title

    Scenario: The broadcasts message appears and can be clicked
        Given the user can see the "Broadcasts" subheading
        And the user can see the broadcast banner
        When the user clicks the "Read more" link
        Then the user sees the "Broadcasts" page caption

    Scenario: The broadcast screen displays correct information
        Given the user sees the "Broadcasts" page caption
        And the user sees the "Cypress broadcast message" page title
        Then the user sees the broadcast <subheadings>
        And the user sees the broadcast <dates>
        And the user sees the broadcast <message>

        Examples:
            | subheadings |
            | Details     |
            | Message     |

        Examples:
            | dates         |
            | Start date:   |
            | End date:     |
            | 30 March 2023 |
            | 31 March 2027 |

        Examples:
            | message                            |
            | This is a test message for Cypress |

    Scenario: The broadcast screen has a working backlink
        When the user clicks the "Back to Project" backlink
        Then the user sees the "Dashboard" page title