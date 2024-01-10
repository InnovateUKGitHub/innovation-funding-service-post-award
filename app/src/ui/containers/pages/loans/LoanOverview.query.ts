import { graphql } from "react-relay";

export const loanOverviewQuery = graphql`
  query LoanOverviewQuery($projectId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                isActive
                roles {
                  isMo
                  isFc
                  isPm
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
              }
            }
          }
          Acc_Prepayment__c(
            where: { Acc_ProjectParticipant__r: { Acc_ProjectId__c: { eq: $projectId } } }
            orderBy: { Acc_PeriodNumber__c: { order: ASC } }
            first: 1000
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
                Loan_UserComments__c {
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
