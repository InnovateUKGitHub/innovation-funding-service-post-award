import { graphql } from "react-relay";
export const claimPrepareQuery = graphql`
  query ClaimPrepareQuery($projectId: ID!, $projectIdStr: String, $partnerId: ID!, $periodId: Double!) {
    currentUser {
      email
    }
    salesforce {
      uiapi {
        query {
          Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                {
                  or: [
                    { RecordType: { Name: { eq: "Profile Detail" } } }
                    { RecordType: { Name: { eq: "Total Cost Category" } } }
                  ]
                }
                { Acc_CostCategory__c: { ne: null } }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                Id
                RecordType {
                  Name {
                    value
                  }
                }
                Acc_CostCategory__c {
                  value
                }
                Acc_CostCategory__r {
                  Acc_CostCategoryName__c {
                    value
                  }
                }
                Acc_CostCategoryGOLCost__c {
                  value
                }
                Acc_OverrideAwardRate__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_ProfileOverrideAwardRate__c {
                  value
                }
                Acc_ProjectPeriodStartDate__c {
                  value
                }
                Acc_ProjectPeriodEndDate__c {
                  value
                }
                Acc_LatestForecastCost__c {
                  value
                }
                RecordType {
                  Name {
                    value
                  }
                }
              }
            }
          }
          Acc_StatusChange__c(
            where: {
              Acc_Claim__r: {
                and: [
                  { Acc_ProjectParticipant__c: { eq: $partnerId } }
                  { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
                ]
              }
            }
            orderBy: { CreatedDate: { order: DESC } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_NewClaimStatus__c {
                  value
                }
                Acc_ExternalComment__c {
                  value
                }
                Acc_ParticipantVisibility__c {
                  value
                }
                Acc_CreatedByAlias__c {
                  value
                }
                CreatedDate {
                  value
                }
              }
            }
          }
          Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                {
                  or: [
                    { RecordType: { Name: { eq: "Total Project Period" } } }
                    { RecordType: { Name: { eq: "Claims Detail" } } }
                  ]
                }
                { Acc_ClaimStatus__c: { ne: "New" } }
                { Acc_ClaimStatus__c: { ne: "Not used" } }
              ]
            }
            first: 2000
            orderBy: { Acc_ProjectParticipant__r: { Acc_AccountId__r: { Name: { order: ASC } } } }
          ) {
            edges {
              node {
                Id
                RecordType {
                  Name {
                    value
                  }
                }
                Acc_Grant_Paid_To_Date__c {
                  value
                }
                Acc_ProjectParticipant__r {
                  Id
                  Acc_AccountId__r {
                    Name {
                      value
                    }
                  }
                }
                LastModifiedDate {
                  value
                }
                Acc_ApprovedDate__c {
                  value
                }
                Acc_ClaimStatus__c {
                  value
                  label
                }
                Acc_PaidDate__c {
                  value
                }
                Acc_ProjectPeriodEndDate__c {
                  value
                }
                Acc_ProjectPeriodStartDate__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_ProjectPeriodCost__c {
                  value
                }
                Acc_PeriodCostCategoryTotal__c {
                  value
                }
                Acc_PeriodCoststobePaid__c {
                  value
                }
                Acc_TotalCostsApproved__c {
                  value
                }
                Acc_TotalCostsSubmitted__c {
                  value
                }
                Acc_TotalDeferredAmount__c {
                  value
                }
                Acc_FinalClaim__c {
                  value
                }
                Acc_CostCategory__c {
                  value
                }
              }
            }
          }
          Acc_CostCategory__c(first: 2000) {
            edges {
              node {
                Id
                Acc_CostCategoryName__c {
                  value
                }
                Acc_DisplayOrder__c {
                  value
                }
                Acc_OrganisationType__c {
                  value
                }
                Acc_CompetitionType__c {
                  value
                }
              }
            }
          }
          Acc_ProjectParticipant__c(
            where: { and: [{ Acc_ProjectId__c: { eq: $projectId } }, { Id: { eq: $partnerId } }] }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                Acc_AccountId__c {
                  value
                }
                Acc_ProjectRole__c {
                  value
                }
                Acc_OrganisationType__c {
                  value
                }
                Acc_ParticipantStatus__c {
                  value
                }
                Acc_Award_Rate__c {
                  value
                }
                Acc_StaticCapLimitGrant__c {
                  value
                }
                Acc_TotalParticipantCosts__c {
                  value
                }
              }
            }
          }
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                isActive
                roles {
                  isMo
                  isFc
                  isPm
                  partnerRoles {
                    isMo
                    isFc
                    isPm
                    partnerId
                  }
                }
                Acc_NonFEC__c {
                  value
                }
                Acc_CompetitionId__r {
                  Name {
                    value
                  }
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_NumberofPeriods__c {
                  value
                }
                Acc_CurrentPeriodNumber__c {
                  value
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ClaimsUnderQuery__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_ClaimFrequency__c {
                  value
                }
                Acc_GOLTotalCostAwarded__c {
                  value
                }
                Acc_ClaimsOverdue__c {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;
