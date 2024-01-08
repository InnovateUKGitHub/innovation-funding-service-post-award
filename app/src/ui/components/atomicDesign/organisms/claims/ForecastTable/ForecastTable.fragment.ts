import { graphql } from "react-relay";

export const forecastTableFragment = graphql`
  fragment ForecastTableFragment on UIAPI {
    query {
      ForecastTable_ProfileForCostCategory: Acc_Profile__c(
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
            Acc_CostCategory__c {
              value
            }
          }
        }
      }
      ForecastTable_ForecastDetails: Acc_Profile__c(
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
              DeveloperName {
                value
              }
            }
          }
        }
      }

      ForecastTable_GolCosts: Acc_Profile__c(
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

      ForecastTable_AllClaimsForPartner: Acc_Claims__c(
        where: {
          and: [
            { Acc_ProjectParticipant__c: { eq: $partnerId } }
            { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
            { Acc_ClaimStatus__c: { ne: "New" } }
            { Acc_ClaimStatus__c: { ne: "Not used" } }
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
            Id
            Acc_ClaimStatus__c {
              value
            }
            Acc_ProjectPeriodNumber__c {
              value
            }
          }
        }
      }
      ForecastTable_ClaimDetails: Acc_Claims__c(
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
              DeveloperName {
                value
              }
            }
            Acc_CostCategory__c {
              value
            }
            Acc_ClaimStatus__c {
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
      ForecastTable_ClaimsForIarDue: Acc_Claims__c(
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
      ForecastTable_CostCategory: Acc_CostCategory__c(first: 2000) {
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
      ForecastTable_Partner: Acc_ProjectParticipant__c(
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
            Acc_ProjectRole__c {
              value
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
      ForecastTable_Project: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
        edges {
          node {
            Id
            Acc_CompetitionType__c {
              value
            }
            Acc_NumberofPeriods__c {
              value
            }
            Acc_ClaimFrequency__c {
              value
            }
            Acc_CurrentPeriodNumber__c {
              value
            }
          }
        }
      }
    }
  }
`;
