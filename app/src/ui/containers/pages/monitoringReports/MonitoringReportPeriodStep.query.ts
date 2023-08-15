import { graphql } from "react-relay";

export const monitoringReportPeriodStepQuery = graphql`
  query MonitoringReportPeriodStepQuery($projectId: ID!, $monitoringReportId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_MonitoringAnswer__c(
            where: { Id: { eq: $monitoringReportId } }
            orderBy: { LastModifiedDate: { order: DESC } }
            first: 1000
          ) {
            edges {
              node {
                Id
                RecordType {
                  Name {
                    value
                  }
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
              }
            }
          }
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
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
