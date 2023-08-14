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
                { RecordType: { Name: { eq: "Total Cost Category" } } }
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
                  Name {
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
                { RecordType: { Name: { eq: "Profile Detail" } } }
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
