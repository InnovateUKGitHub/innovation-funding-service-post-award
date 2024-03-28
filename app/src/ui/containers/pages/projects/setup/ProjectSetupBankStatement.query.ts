import { graphql } from "react-relay";

export const projectSetupBankStatementQuery = graphql`
  query ProjectSetupBankStatementQuery($projectId: ID!, $partnerId: ID!) {
    currentUser {
      userId
    }
    salesforce {
      uiapi {
        ...PageFragment
        ...ProjectDocumentViewFragment
      }
    }
  }
`;
