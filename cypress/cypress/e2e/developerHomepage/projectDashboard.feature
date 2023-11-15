Feature: Project dashboard
    The Project dashboard allows users to navigate to and filter all of their projects

    Background: The Projects tile takes me to the projects dashboard
        Given the user is on the developer homepage
        When the user clicks the "Projects dashboard" tile
        Then the user sees the "Dashboard" page title

    Scenario: The search box accepts project number input
        Given the user can see the "Projects" subheading
        And the user can see the "Search" area
        And the user can see search guidance
        When the user searches for "11111"
        Then the project count should read "1"
        And the user will see project "11111" listed

    Scenario: The search box accepts partner name input
        When the user searches for "EUI Small Ent Health"
        Then the project count should read "38"

    Scenario: The search box accepts project title input
        When the user searches for "Project title"
        Then the project count should read "1"
        And the user will see project "Project title" listed

    Scenario: The filter options work correctly
        Given the user can see the "Filter options" subheading
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
        Given the user sees Upcoming and Archived buttons
        When the user clicks the "Show all sections" accordion
        Then the accordions should open

    Scenario: The backlink works correctly
        When the user clicks the "back to homepage" backlink
        Then the user sees the "Home" page title