import { graphql } from "react-relay";

export const monitoringReportDashboardQuery = graphql`
  query MonitoringReportDashboardQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_MonitoringAnswer__c(
            where: { Acc_Project__c: { eq: $projectId } }
            orderBy: { LastModifiedDate: { order: DESC } }
            first: 1000
          ) {
            edges {
              node {
                Id
                Acc_MonitoringReportStatus__c {
                  value
                  label
                }
                LastModifiedDate {
                  value
                }
                Acc_Project__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_AddComments__c {
                  value
                }
                Acc_PeriodStartDate__c {
                  value
                }
                Acc_PeriodEndDate__c {
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
