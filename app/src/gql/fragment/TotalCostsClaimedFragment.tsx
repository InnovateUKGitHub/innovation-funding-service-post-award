import { graphql } from "react-relay";

export const totalCostsClaimedFragment = graphql`
  fragment TotalCostsClaimedFragment on UIAPI {
    query {
      TotalCostsClaimed_ClaimDetails: Acc_Claims__c(
        where: {
          and: [
            { Acc_ProjectParticipant__c: { eq: $partnerId } }
            { RecordType: { DeveloperName: { eq: "Claims_Detail" } } }
            { Acc_ClaimStatus__c: { ne: "New" } }
            { Acc_CostCategory__c: { ne: null } }
          ]
        }
        first: 2000
        orderBy: { Acc_CostCategory__c: { order: ASC }, Acc_ProjectPeriodNumber__c: { order: ASC } }
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
            Acc_PeriodCostCategoryTotal__c {
              value
            }
            Acc_ProjectPeriodNumber__c {
              value
            }
          }
        }
      }
      TotalCostsClaimed_ClaimOverrides: Acc_Profile__c(
        where: {
          and: [
            { Acc_ProjectParticipant__c: { eq: $partnerId } }
            { RecordType: { DeveloperName: { eq: "Total_Cost_Category" } } }
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
          }
        }
      }
    }
  }
`;
