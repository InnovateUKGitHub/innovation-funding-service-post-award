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
      TotalCostsClaimed_CostCategory: Acc_CostCategory__c(first: 2000) {
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
            Acc_OverrideAwardRate__c {
              value
            }
          }
        }
      }
      TotalCostsClaimed_Partner: Acc_ProjectParticipant__c(
        where: { and: [{ Acc_ProjectId__c: { eq: $projectId } }, { Id: { eq: $partnerId } }] }
        first: 2000
      ) {
        edges {
          node {
            Id
            Acc_Award_Rate__c {
              value
            }
          }
        }
      }
      TotalCostsClaimed_Project: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
        edges {
          node {
            Id
            Acc_NonFEC__c {
              value
            }
          }
        }
      }
    }
  }
`;
