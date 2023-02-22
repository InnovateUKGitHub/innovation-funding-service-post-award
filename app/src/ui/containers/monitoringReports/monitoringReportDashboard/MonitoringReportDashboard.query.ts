import { graphql } from "react-relay";

export const monitoringReportDashboardQuery = graphql`
  query MonitoringReportDashboardQuery($projectId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_MonitoringAnswer__c(
            where: { Acc_Project__c: { eq: $projectId } }
            orderBy: { LastModifiedDate: { order: DESC } }
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
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                roles {
                  isMo
                  isFc
                  isPm
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectStatus__c {
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
