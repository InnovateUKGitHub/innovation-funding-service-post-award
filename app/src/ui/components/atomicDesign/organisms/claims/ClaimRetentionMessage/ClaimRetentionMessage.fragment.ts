import { graphql } from "react-relay";

export const claimRetentionMessageFragment = graphql`
  fragment ClaimRetentionMessageFragment on UIAPI {
    query {
      ClaimRetentionMessage_ClaimDetails: Acc_Claims__c(
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
            Acc_ProjectPeriodNumber__c {
              value
            }
          }
        }
      }
      ClaimRetentionMessage_CostCategory: Acc_CostCategory__c(first: 2000) {
        edges {
          node {
            Id
          }
        }
      }

      ClaimRetentionMessage_Partner: Acc_ProjectParticipant__c(
        where: { and: [{ Acc_ProjectId__c: { eq: $projectId } }, { Id: { eq: $partnerId } }] }
        first: 2000
      ) {
        edges {
          node {
            Id
            Acc_StaticCapLimitGrant__c {
              value
            }
            Acc_TotalApprovedCosts__c {
              value
            }
          }
        }
      }
    }
  }
`;
