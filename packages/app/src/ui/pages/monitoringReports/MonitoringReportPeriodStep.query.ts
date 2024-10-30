import { graphql } from "react-relay";

export const monitoringReportPeriodStepQuery = graphql`
  query MonitoringReportPeriodStepQuery($projectId: ID!, $monitoringReportId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
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
                  DeveloperName {
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
