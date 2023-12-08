import { graphql } from "react-relay";
export const projectSetupSpendProfileQuery = graphql`
  query ProjectSetupSpendProfileQuery($projectId: ID!, $partnerId: ID!, $projectIdStr: String) {
    currentUser {
      email
    }
    salesforce {
      uiapi {
        query {
          GolCostProfile: Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { RecordType: { DeveloperName: { eq: "Total_Cost_Category" } } }
                { Acc_CostCategory__c: { ne: null } }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_CostCategory__c {
                  value
                }
                Acc_CostCategoryGOLCost__c {
                  value
                }
                RecordType {
                  DeveloperName {
                    value
                  }
                }
              }
            }
          }
          ForecastDetails: Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { RecordType: { DeveloperName: { eq: "Profile_Detail" } } }
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
                Acc_ProjectPeriodNumber__c {
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
                Acc_InitialForecastCost__c {
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
          ) {
            edges {
              node {
                Id
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                Acc_OrganisationType__c {
                  value
                }
                Acc_ParticipantStatus__c {
                  value
                }
                Acc_OverheadRate__c {
                  value
                }
              }
            }
          }
          ClaimsForIarDue: Acc_Claims__c(
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
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                RecordType {
                  DeveloperName {
                    value
                  }
                }
                Acc_IAR_Status__c {
                  value
                }
                Acc_IARRequired__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
              }
            }
          }
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                Acc_NumberofPeriods__c {
                  value
                }
                Acc_CurrentPeriodNumber__c {
                  value
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
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
