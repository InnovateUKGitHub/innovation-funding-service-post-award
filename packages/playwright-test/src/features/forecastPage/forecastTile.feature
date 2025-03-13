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

  Scenario: Presence of an IAR on a claim updates the Forecast table
    Given a multi-partner CR&D project with profiles exists
    And the user is the "mainFcUser" user
    When the user accesses the Forecast page
    Then the Forecast table will show required 'Yes' for IAR period 1

    When the user has accessed the Costs to be claimed page
    And the user has accessed the claim documents page

    When the user uploads an Independent Accountant's Report
    And the user accesses the Forecast page
    Then the Forecast table will show required 'No' for IAR period 1

  Scenario: Updating costs in a claim reflect on the Forecast table
    Given a multi-partner CR&D project with profiles exists
    And the user is the "mainFcUser" user
    And the user has accessed the Costs to be claimed page

    When the user updates all cost categories
      | Category               | Cost    |
      | Labour                 | 100001  |
      | Overheads              | 20000.2 |
      | Materials              | 100001  |
      | Capital usage          | 100001  |
      | Subcontracting         | 100001  |
      | Travel and subsistence | 100001  |
      | Other costs            | 100001  |
      | Other costs 2          | 100001  |
      | Other costs 3          | 100001  |
      | Other costs 4          | 100001  |
      | Other costs 5          | 100001  |
    And the user accesses the Forecast page
    Then the claims costs are reflected on the Forecast table
      | Category               | Cost    |
      | Labour                 | 100001  |
      | Overheads              | 20000.2 |
      | Materials              | 100001  |
      | Capital usage          | 100001  |
      | Subcontracting         | 100001  |
      | Travel and subsistence | 100001  |
      | Other costs            | 100001  |
      | Other costs 2          | 100001  |
      | Other costs 3          | 100001  |
      | Other costs 4          | 100001  |
      | Other costs 5          | 100001  |
    And the user will see an overclaim warning
      | Category               |
      | Labour                 |
      | Overheads              |
      | Materials              |
      | Capital usage          |
      | Subcontracting         |
      | Travel and subsistence |
      | Other costs            |
      | Other costs 2          |
      | Other costs 3          |
      | Other costs 4          |
      | Other costs 5          |

#Future additions:
#Moving claims on to paid updates the forecast table
#MO view of Forecast table
#PM view of forecast table
