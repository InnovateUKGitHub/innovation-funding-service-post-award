@mode:serial
Feature: Grant Adjustments
  Scenario: Grant adjustments do not appear before approval
    Given a multi-partner CR&D project with profiles exists
    And the user is the "mainFcUser" user
    And the user is on the finance summary page
    Then the partner finance details matches
      | Participant                 | GOLCosts | FundingLevel | ApprovedGrant | RemainingGrant | AdvanceGrant | CapLevel | CapPot |
      | Hedge's Primary Ltd. (Lead) | 79560000 | 50           | 0             | 39780000       | 0            | 50       | 0      |

  Scenario: Grant adjustments appear after approval
    Given a multi-partner CR&D project with profiles exists
    And the user is the "mainFcUser" user
    And the grant adjustment "grantAdjustment" is approved by the system user
    And the user is on the finance summary page
    Then the partner finance details matches
      | Participant                 | GOLCosts | FundingLevel | ApprovedGrant | RemainingGrant | AdvanceGrant | CapLevel | CapPot |
      | Hedge's Primary Ltd. (Lead) | 79560000 | 50           | 10000000      | 29780000       | 10000000     | 50       | 0      |
