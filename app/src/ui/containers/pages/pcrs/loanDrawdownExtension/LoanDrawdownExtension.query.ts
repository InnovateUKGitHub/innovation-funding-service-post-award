import { graphql } from "react-relay";

export const loanDrawdownExtensionQuery = graphql`
  query LoanDrawdownExtensionQuery($projectId: ID!, $pcrItemId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrItemId } }, first: 1) {
            edges {
              node {
                Id
                Acc_AdditionalNumberofMonths__c {
                  value
                }
                Acc_MarkedasComplete__c {
                  value
                }
                Acc_Status__c {
                  value
                }
                Loan_Duration__c {
                  value
                }
                Loan_ExtensionPeriod__c {
                  value
                }
                Loan_ExtensionPeriodChange__c {
                  value
                }
                Loan_RepaymentPeriod__c {
                  value
                }
                Loan_RepaymentPeriodChange__c {
                  value
                }
                Loan_ProjectStartDate__c {
                  value
                }
                RecordType {
                  Name {
                    value
                    label
                  }
                  DeveloperName {
                    value
                  }
                }
              }
            }
          }
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                roles {
                  isPm
                  isFc
                  isMo
                }
                Acc_NumberofPeriods__c {
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
