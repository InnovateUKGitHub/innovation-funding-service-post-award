import { graphql } from "react-relay";

export const monitoringReportDeleteQuery = graphql`
  query MonitoringReportDeleteQuery($projectId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
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
