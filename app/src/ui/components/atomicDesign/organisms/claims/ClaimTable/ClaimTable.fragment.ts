import { graphql } from "react-relay";

export const claimTableFragment = graphql`
  fragment ClaimTableFragment on UIAPI {
    query {
      ClaimTable_ProfileForCostCategory: Acc_Profile__c(
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
            Acc_CostCategory__c {
              value
            }
          }
        }
      }
      ClaimTable_ForecastDetails: Acc_Profile__c(
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
            RecordType {
              Name {
                value
              }
            }
          }
        }
      }

      ClaimTable_GolCosts: Acc_Profile__c(
        where: {
          and: [
            { Acc_ProjectParticipant__c: { eq: $partnerId } }
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
      ClaimTable_ClaimDetails: Acc_Claims__c(
        where: {
          and: [
            { Acc_ProjectParticipant__c: { eq: $partnerId } }
            { RecordType: { Name: { eq: "Claims Detail" } } }
            { Acc_ClaimStatus__c: { ne: "New" } }
            { Acc_CostCategory__c: { ne: null } }
          ]
        }
        first: 2000
        orderBy: { Acc_ProjectParticipant__r: { Acc_AccountId__r: { Name: { order: ASC } } } }
      ) {
        edges {
          node {
            RecordType {
              Name {
                value
              }
            }
            Acc_CostCategory__c {
              value
            }
            Acc_PeriodCostCategoryTotal__c {
              value
            }
            Acc_ProjectPeriodEndDate__c {
              value
            }
            Acc_ProjectPeriodNumber__c {
              value
            }
            Acc_ProjectPeriodStartDate__c {
              value
            }
          }
        }
      }
      ClaimTable_CostCategory: Acc_CostCategory__c(first: 2000) {
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
      ClaimTable_Partner: Acc_ProjectParticipant__c(
        where: { and: [{ Acc_ProjectId__c: { eq: $projectId } }, { Id: { eq: $partnerId } }] }
        first: 2000
      ) {
        edges {
          node {
            Id
            Acc_OrganisationType__c {
              value
            }
          }
        }
      }
      ClaimTable_Project: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
        edges {
          node {
            Id
            Acc_CompetitionType__c {
              value
            }
          }
        }
      }
    }
  }
`;
