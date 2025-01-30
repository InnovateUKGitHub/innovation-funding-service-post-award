@mode:serial
Feature: Forecast Tile
  Scenario: Viewing the forecast page for a Commercial partner
    Given a multi-partner CR&D project with profiles exists
    And the user is the "mainFcUser" user
    When the user accesses the Forecast page
    Then the user sees the project forecast for "Hedge's Primary Ltd."
      | Category               | Row number |
      | Labour                 | 1          |
      | Materials              | 3          |
      | Capital usage          | 4          |
      | Subcontracting         | 5          |
      | Travel and subsistence | 6          |
      | Other costs            | 7          |
      | Other costs 2          | 8          |
      | Other costs 3          | 9          |
      | Other costs 4          | 10         |
      | Other costs 5          | 11         |

    When the user clicks Edit forecast button
    And the user enters invalid information into the "Project" forecast
    Then the user will be advised of correct entries

    When the user enters more than the agreed value for "Labour"
    Then the user is advised they have exceeded costs for "Labour"

    When the user exceeds the grant value
    Then the user will be told they have exceeded the grant value

    When the user updates and saves the Project forecast table
      | Category               | Row number |
      | Labour                 | 1          |
      | Materials              | 3          |
      | Capital usage          | 4          |
      | Subcontracting         | 5          |
      | Travel and subsistence | 6          |
      | Other costs            | 7          |
      | Other costs 2          | 8          |
      | Other costs 3          | 9          |
      | Other costs 4          | 10         |
      | Other costs 5          | 11         |

    Then the "Project" figures accurately reflect the changes
      | Category               | Row number |
      | Labour                 | 1          |
      | Materials              | 3          |
      | Capital usage          | 4          |
      | Subcontracting         | 5          |
      | Travel and subsistence | 6          |
      | Other costs            | 7          |
      | Other costs 2          | 8          |
      | Other costs 3          | 9          |
      | Other costs 4          | 10         |
      | Other costs 5          | 11         |