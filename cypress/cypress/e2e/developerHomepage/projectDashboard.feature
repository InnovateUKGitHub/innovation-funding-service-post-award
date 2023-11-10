Feature: Project dashboard
    Scenario: The Projects tile takes me to the projects dashboard
        Given the user is on the developer homepage
        When the user clicks the "Projects dashboard" tile
        Then the user sees the "Dashboard" page title

    Scenario: The backlink works correctly
        Given the user is on the projects dashboard
        When the user clicks the "back to homepage" backlink
        Then the user sees the "Home" page title

    Scenario: The broadcasts message appears and can be clicked
        Given the user is on the projects dashboard
        And the user can see the "Broadcasts" subheading
        And the user can see the broadcast banner
        When the user clicks the "Read more" link
        Then the user sees the "Broadcasts" page caption

    Scenario: The broadcast screen displays correct information
        Given the user is on the broadcast page
        And the user sees the "Broadcasts" page caption
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

    Scenario: The search box accepts project number input
        Given the user is on the projects dashboard
        And the user can see the "Projects" subheading
        And the user can see the "Search" area
        And the user can see search guidance
        When the user searches for "11111"
        Then the project count should read "1"
        And the user will see project "11111" listed

    Scenario: The search box accepts partner name input
        Given the user is on the projects dashboard
        And the user can see the "Search" area
        When the user searches for "EUI Small Ent Health"
        Then the project count should read "38"

    Scenario: The search box accepts project title input
        Given the user is on the projects dashboard
        And the user can see the "Search" area
        When the user searches for "Project title"
        Then the project count should read "1"
        And the user will see project "Project title" listed

    Scenario: The filter options work correctly
        Given the user is on the projects dashboard
        And the user can see the "Filter options" subheading
        When the user clicks the <checkbox> checkbox
        Then the user sees the filtered <items> listed on the project cards

        Examples:
            | checkbox                 | items                           |
            | PCR's to review          | Project change requests to view |
            | PCR's being queried      | Project change request queried  |
            | Claims to review         | Claims to review                |
            | Claims to submit         | You need to submit your claim.  |
            | Claims missing documents | Claims missing documents        |
            | Claims needing responses | Claim queried                   |
            | Not completed setup      | You need to set up your project |

    Scenario: The show all section opens and displays correct information
        Given the user is on the projects dashboard
        And the user sees Upcoming and Archived buttons
        When the user clicks the "Show all sections" accordion
        Then the accordions should open

    Scenario: The broadcast screen has a working backlink
        Given the user is on the broadcast page
        And the user sees the "Broadcasts" page caption
        When the user clicks the "Back to Project" backlink
        Then the user sees the "Dashboard" page title