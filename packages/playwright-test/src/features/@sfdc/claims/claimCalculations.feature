@mode:serial
Feature: Claims and Project Participant calculations are correct after a claim
  Scenario: First claim
    Given a standard CR&D project exists
    And the user is the "mainFcUser" user
    And the user is on the finance summary page
    Then the partner finance details matches
      | Participant                 | GOLCosts | FundingLevel | ApprovedGrant | RemainingGrant | AdvanceGrant | CapLevel | CapPot |
      | Hedge's Primary Ltd. (Lead) | 12240    | 50           | 0             | 6120           | 0            | 50       | 0      |
    Then the SObject "mainProjectParticipant" should now match data
      | key                        | value |
      | Acc_TotalApprovedCosts__c  | null  |
      | Acc_TotalCostsSubmitted__c | null  |
      | Acc_TotalGrantApproved__c  | null  |


    Given the user is on the prepare "claimPeriod1" claim summary page
    When the user attempts to submit the claim
    Given the user is the "mspUser" user
    And the user is on the review "claimPeriod1" claim summary page
    When the user selects the "Submit for approval" option
    When submits the claim to Innovate UK
    Then the claim will have the status "Submitted to Innovate UK"

    Given the system user approves the "claimPeriod1" claim
    And the user is the "mainFcUser" user
    And the user is on the finance summary page
    Then the partner finance details matches
      | Participant                 | GOLCosts | FundingLevel | ApprovedGrant | RemainingGrant | AdvanceGrant | CapLevel | CapPot |
      | Hedge's Primary Ltd. (Lead) | 12240    | 50           | 49.51         | 6070.49        | 0            | 50       | 0      |
    And the SObject "claimPeriod1" should now match data
      | key                            | value |
      | Acc_PeriodCostsApproved__c     | 99.01 |
      | Acc_PeriodCostsSubmitted__c    | 99.01 |
      | Acc_PeriodCostsToBeApproved__c | 99.01 |
      | Acc_ProjectPeriodCost__c       | 99.01 |
      | Acc_TotalCostsApproved__c      | 99.01 |
      | Acc_TotalCostsSubmitted__c     | 99.01 |
      | Net_Invoice_total__c           | 99.01 |
    And the SObject "mainProjectParticipant" should now match data
      | key                        | value |
      | Acc_TotalApprovedCosts__c  | 99.01 |
      | Acc_TotalCostsSubmitted__c | 99.01 |
      | Acc_TotalGrantApproved__c  | 49.51 |

    When the SObject "claimPeriod2" is updated with data
      | key                | value |
      | Acc_ClaimStatus__c | Draft |
    Given the user is on the prepare "claimPeriod2" claim summary page
    When the user attempts to submit the claim
    Given the user is the "mspUser" user
    And the user is on the review "claimPeriod2" claim summary page
    When the user selects the "Submit for approval" option
    When submits the claim to Innovate UK
    Then the claim will have the status "Submitted to Innovate UK"

    Given the system user approves the "claimPeriod2" claim
    And the user is the "mainFcUser" user
    And the user is on the finance summary page
    Then the partner finance details matches
      | Participant                 | GOLCosts | FundingLevel | ApprovedGrant | RemainingGrant | AdvanceGrant | CapLevel | CapPot |
      | Hedge's Primary Ltd. (Lead) | 12240    | 50           | 99.02         | 6020.98        | 0            | 50       | 0      |
    And the SObject "claimPeriod2" should now match data
      | key                            | value |
      | Acc_PeriodCostsApproved__c     | 99.02 |
      | Acc_PeriodCostsSubmitted__c    | 99.02 |
      | Acc_PeriodCostsToBeApproved__c | 99.02 |
      | Acc_ProjectPeriodCost__c       | 99.02 |
      | Acc_TotalCostsApproved__c      | 99.02 |
      | Acc_TotalCostsSubmitted__c     | 99.02 |
      | Net_Invoice_total__c           | 99.02 |
    And the SObject "mainProjectParticipant" should now match data
      | key                        | value  |
      | Acc_TotalApprovedCosts__c  | 198.03 |
      | Acc_TotalCostsSubmitted__c | 198.03 |
      | Acc_TotalGrantApproved__c  | 99.02  |
