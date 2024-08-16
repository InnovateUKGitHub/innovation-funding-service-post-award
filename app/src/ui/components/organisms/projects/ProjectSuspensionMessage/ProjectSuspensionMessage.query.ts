import { graphql } from "react-relay";

export const projectSuspensionMessageQuery = graphql`
  query ProjectSuspensionMessageQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...ProjectSuspensionMessageFragment
      }
    }
  }
`;
