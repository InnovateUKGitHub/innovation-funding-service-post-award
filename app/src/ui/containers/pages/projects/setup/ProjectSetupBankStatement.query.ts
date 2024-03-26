import { graphql } from "react-relay";

export const projectSetupBankStatementQuery = graphql`
  query ProjectSetupBankStatementQuery($projectId: ID!, $partnerId: ID!) {
    currentUser {
      userId
    }
    salesforce {
      uiapi {
        ...TitleFragment
        ...ProjectDocumentViewFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                isActive
              }
            }
          }
        }
      }
    }
  }
`;
