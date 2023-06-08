import { graphql } from "relay-hooks";

export const projectSetupBankDetailsQuery = graphql`
  query ProjectSetupBankDetailsQuery($projectId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
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
