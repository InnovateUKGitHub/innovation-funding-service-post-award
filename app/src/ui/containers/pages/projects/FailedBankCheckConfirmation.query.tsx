import { graphql } from "react-relay";

export const failedBankCheckConfirmationQuery = graphql`
  query FailedBankCheckConfirmationQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...TitleFragment
        ...ProjectSuspensionMessageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                isActive
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
