import { graphql } from "react-relay";
export const claimPrepareQuery = graphql`
  query ClaimPrepareQuery($projectId: ID!, $projectIdStr: String, $partnerId: ID!, $periodId: Double!) {
    currentUser {
      email
    }
    salesforce {
      uiapi {
        ...ClaimTableFragment
        ...StatusChangesLogsFragment
        ...TitleFragment
        ...ClaimPeriodDateFragment
        query {
          ClaimOverrides: Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                {
                  or: [
                    { RecordType: { DeveloperName: { eq: "Profile_Detail" } } }
                    { RecordType: { DeveloperName: { eq: "Total_Cost_Category" } } }
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
                  DeveloperName {
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
                Acc_OverrideAwardRate__c {
                  value
                }
                Acc_ProfileOverrideAwardRate__c {
                  value
                }
              }
            }
          }
          ClaimDetails: Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { RecordType: { DeveloperName: { eq: "Claims Detail" } } }
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

                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_PeriodCostCategoryTotal__c {
                  value
                }
                Acc_CostCategory__c {
                  value
                }
              }
            }
          }
          Claims: Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
                { RecordType: { Name: { eq: "Total Project Period" } } }
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
                Acc_ClaimStatus__c {
                  value
                  label
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
                Acc_FinalClaim__c {
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
                Acc_AccountId__c {
                  value
                }
                Acc_ParticipantStatus__c {
                  value
                }
                Acc_StaticCapLimitGrant__c {
                  value
                }
                Acc_TotalApprovedCosts__c {
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
                Acc_ProjectStatus__c {
                  value
                }
                Acc_CompetitionType__c {
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
