import { graphql } from "react-relay";

export const failedBankCheckConfirmationQuery = graphql`
  query FailedBankCheckConfirmationQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...TitleFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Acc_ProjectStatus__c {
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
