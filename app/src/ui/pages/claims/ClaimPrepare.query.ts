import { graphql } from "react-relay";
export const claimPrepareQuery = graphql`
  query ClaimPrepareQuery($projectId: ID!, $projectIdStr: String, $partnerId: ID!, $periodId: Double!) {
    salesforce {
      uiapi {
        ...StatusChangesLogsFragment
        ...PageFragment
        ...AwardRateOverridesMessageFragment
        query {
          Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                {
                  or: [
                    { RecordType: { DeveloperName: { eq: "Profile_Detail" } } }
                    { RecordType: { DeveloperName: { eq: "Total_Cost_Category" } } }
                  ]
                }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                Id
                RecordType {
                  DeveloperName {
                    value
                  }
                }
                Acc_CostCategory__c {
                  value
                }
                Acc_CostCategory__r {
                  Id
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
                    { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
                    { RecordType: { DeveloperName: { eq: "Claims_Detail" } } }
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
                  DeveloperName {
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
                Acc_TotalGrantApproved__c {
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
                  isAssociate
                  partnerRoles {
                    isMo
                    isFc
                    isPm
                    isAssociate
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
                Acc_ClaimsUnderQuery__c {
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