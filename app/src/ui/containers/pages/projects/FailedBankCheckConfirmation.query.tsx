import { graphql } from "react-relay";

export const failedBankCheckConfirmationQuery = graphql`
  query FailedBankCheckConfirmationQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        ...ProjectSuspensionMessageFragment
      }
    }
  }
`;
