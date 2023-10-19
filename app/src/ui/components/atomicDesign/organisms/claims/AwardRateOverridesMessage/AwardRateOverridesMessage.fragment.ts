import { graphql } from "react-relay";

export const awardRateOverridesMessageFragment = graphql`
  fragment AwardRateOverridesMessageFragment on UIAPI {
    query {
      AwardRateOverridesMessage_Project: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
        edges {
          node {
            Acc_NonFEC__c {
              value
            }
          }
        }
      }
      AwardRateOverridesMessage_Profile: Acc_Profile__c(
        where: {
          and: [
            { Acc_ProjectParticipant__c: { eq: $partnerId } }
            {
              or: [
                { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
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
    }
  }
`;
