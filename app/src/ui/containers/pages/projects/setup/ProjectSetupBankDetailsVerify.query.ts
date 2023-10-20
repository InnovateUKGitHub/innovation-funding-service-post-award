import { graphql } from "react-relay";
export const projectSetupBankDetailsVerifyQuery = graphql`
  query ProjectSetupBankDetailsVerifyQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...TitleFragment
      }
    }
  }
`;
