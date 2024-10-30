import { graphql } from "react-relay";

export const monitoringReportDeleteQuery = graphql`
  query MonitoringReportDeleteQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
      }
    }
  }
`;
