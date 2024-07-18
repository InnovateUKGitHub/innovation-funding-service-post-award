import { graphql } from "react-relay";

export const claimDrawdownTableQuery = graphql`
  query ClaimDrawdownTableQuery($projectId: ID!, $periodId: Double!) {
    salesforce {
      uiapi {
        query {
          Acc_Prepayment__c(
            where: {
              Acc_ProjectParticipant__r: { Acc_ProjectId__c: { eq: $projectId } }
              Acc_PeriodNumber__c: { eq: $periodId }
            }
            first: 1
          ) {
            edges {
              node {
                Id
                Acc_PeriodNumber__c {
                  value
                }
                Loan_DrawdownStatus__c {
                  value
                }
                Loan_LatestForecastDrawdown__c {
                  value
                }
                Loan_PlannedDateForDrawdown__c {
                  value
                }
                Acc_GranttobePaid__c {
                  value
                }
                Acc_ProjectParticipant__r {
                  Acc_TotalParticipantCosts__c {
                    value
                  }
                  Acc_TotalGrantApproved__c {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
