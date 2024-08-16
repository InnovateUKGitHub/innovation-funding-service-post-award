import { graphql } from "react-relay";

export const statusChangesLogsQuery = graphql`
  query StatusChangeLogsQuery($projectId: ID!, $partnerId: ID!, $periodId: Double!) {
    salesforce {
      uiapi {
        ...StatusChangesLogsFragment
      }
    }
  }
`;
