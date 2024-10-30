import { graphql } from "react-relay";

export const loanDrawdownChangeQuery = graphql`
  query LoanDrawdownChangeQuery($pcrItemId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Virements__c(
            where: {
              and: [{ Acc_ProjectChangeRequest__c: { eq: $pcrItemId } }, { Loan_PeriodNumber__c: { ne: null } }]
            }
            orderBy: { Loan_PeriodNumber__c: { order: ASC } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Loan_PeriodNumber__c {
                  value
                }
                Loan_CurrentDrawdownValue__c {
                  value
                }
                Loan_CurrentDrawdownDate__c {
                  value
                }
                Loan_NewDrawdownValue__c {
                  value
                }
                Loan_NewDrawdownDate__c {
                  value
                }
                Loan_LoanDrawdownRequest__c {
                  value
                }
                Loan_DrawdownStatus__c {
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
          Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrItemId } }, first: 1) {
            edges {
              node {
                Id
                Acc_MarkedasComplete__c {
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
        }
      }
    }
  }
`;
