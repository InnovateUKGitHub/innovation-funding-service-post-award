import { graphql } from "react-relay";

export const monitoringReportCreateQuery = graphql`
  query MonitoringReportCreateQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                Acc_CurrentPeriodNumber__c {
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
