import { graphql } from "react-relay";

/**
 * N.B. You cannot have duplicate names in React Relay.
 * Remove "new" when old forecast table is over.
 */
export const newForecastTableFragment = graphql`
  fragment NewForecastTableFragment on UIAPI {
    query {
      ForecastTable_Project: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
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

      ForecastTable_ProjectParticipant: Acc_ProjectParticipant__c(where: { Id: { eq: $partnerId } }, first: 1) {
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

      ForecastTable_ClaimTotalProjectPeriods: Acc_Claims__c(
        where: {
          Acc_ProjectParticipant__c: { eq: $partnerId }
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

      ForecastTable_ClaimDetails: Acc_Claims__c(
        where: { Acc_ProjectParticipant__c: { eq: $partnerId }, RecordType: { DeveloperName: { eq: "Claims_Detail" } } }
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

      ForecastTable_ProfileTotalProjectPeriod: Acc_Profile__c(
        where: {
          Acc_ProjectParticipant__c: { eq: $partnerId }
          RecordType: { DeveloperName: { eq: "Total_Project_Period" } }
        }
        first: 100
      ) {
        edges {
          node {
            Acc_ProjectPeriodNumber__c {
              value
            }
            Acc_ProjectPeriodStartDate__c {
              value
            }
            Acc_ProjectPeriodEndDate__c {
              value
            }
          }
        }
      }

      ForecastTable_ProfileTotalCostCategories: Acc_Profile__c(
        where: {
          Acc_ProjectParticipant__c: { eq: $partnerId }
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

      ForecastTable_ProfileDetails: Acc_Profile__c(
        where: {
          Acc_ProjectParticipant__c: { eq: $partnerId }
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
`;
