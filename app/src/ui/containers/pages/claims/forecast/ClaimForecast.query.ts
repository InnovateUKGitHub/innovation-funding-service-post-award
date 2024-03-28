import { graphql } from "relay-runtime";

const claimForecastQuery = graphql`
  query ClaimForecastQuery($projectId: ID!, $projectParticipantId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Acc_NumberofPeriods__c {
                  value
                }
                roles {
                  isFc
                  isPm
                  isMo
                  isAssociate
                }
              }
            }
          }

          Acc_ProjectParticipant__c(where: { Id: { eq: $projectParticipantId } }, first: 1) {
            edges {
              node {
                Acc_ForecastLastModifiedDate__c {
                  value
                }
                Acc_OverheadRate__c {
                  value
                }
              }
            }
          }

          Acc_Claims__c(
            where: {
              Acc_ProjectParticipant__c: { eq: $projectParticipantId }
              RecordType: { DeveloperName: { eq: "Total_Project_Period" } }
            }
            orderBy: { Acc_ProjectPeriodNumber__c: { order: ASC } }
            first: 200
          ) {
            edges {
              node {
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_IAR_Status__c {
                  value
                }
                Acc_IARRequired__c {
                  value
                }
                Acc_ClaimStatus__c {
                  value
                }
                Acc_ProjectPeriodStartDate__c {
                  value
                }
                Acc_ProjectPeriodEndDate__c {
                  value
                }
                Acc_FinalClaim__c {
                  value
                }
              }
            }
          }

          ClaimDetails: Acc_Claims__c(
            where: {
              Acc_ProjectParticipant__c: { eq: $projectParticipantId }
              RecordType: { DeveloperName: { eq: "Claims_Detail" } }
            }
            orderBy: { Acc_ProjectPeriodNumber__c: { order: ASC } }
            first: 2000
          ) {
            edges {
              node {
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

          ProfileTotalCostCategory: Acc_Profile__c(
            where: {
              Acc_ProjectParticipant__c: { eq: $projectParticipantId }
              RecordType: { DeveloperName: { eq: "Total_Cost_Category" } }
            }
            orderBy: { Acc_CostCategory__r: { Acc_DisplayOrder__c: { order: ASC } } }
            first: 2000
          ) {
            edges {
              node {
                Acc_CostCategoryGOLCost__c {
                  value
                }
                Acc_CostCategory__r {
                  Id
                  Acc_CostCategoryName__c {
                    value
                  }
                }
              }
            }
          }

          ProfileDetails: Acc_Profile__c(
            where: {
              Acc_ProjectParticipant__c: { eq: $projectParticipantId }
              RecordType: { DeveloperName: { eq: "Profile_Detail" } }
            }
            orderBy: { Acc_ProjectPeriodNumber__c: { order: ASC } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_InitialForecastCost__c {
                  value
                }
                Acc_LatestForecastCost__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_CostCategory__r {
                  Id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { claimForecastQuery };
