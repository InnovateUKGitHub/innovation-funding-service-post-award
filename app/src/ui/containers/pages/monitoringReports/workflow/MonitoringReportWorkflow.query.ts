import { graphql } from "react-relay";

export const monitoringReportWorkflowQuery = graphql`
  query MonitoringReportWorkflowQuery($projectId: ID!, $monitoringReportId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_StatusChange__c(
            where: { Acc_MonitoringReport__c: { eq: $monitoringReportId } }
            orderBy: { CreatedDate: { order: DESC } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_NewMonitoringReportStatus__c {
                  value
                }
                Acc_PreviousMonitoringReportStatus__c {
                  value
                }
                Acc_MonitoringReport__c {
                  value
                }
                Acc_ExternalComment__c {
                  value
                }
                Acc_CreatedByAlias__c {
                  value
                }
                CreatedDate {
                  value
                }
              }
            }
          }
          Acc_MonitoringAnswer__c(
            where: {
              or: [
                { Id: { eq: $monitoringReportId } }
                {
                  and: [
                    { Acc_MonitoringHeader__c: { eq: $monitoringReportId } }
                    { RecordType: { Name: { eq: "Monitoring Answer" } } }
                  ]
                }
              ]
            }
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
                Acc_MonitoringHeader__c {
                  value
                }
                Acc_Question__c {
                  value
                }
                Acc_QuestionComments__c {
                  value
                }
                Acc_QuestionName__c {
                  value
                }
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
                Acc_PeriodStartDate__c {
                  value
                }
                Acc_PeriodEndDate__c {
                  value
                }
                Acc_AddComments__c {
                  value
                }
              }
            }
          }
          Acc_MonitoringQuestion__c(first: 1000) {
            edges {
              node {
                Id
                Acc_QuestionName__c {
                  value
                }
                Acc_DisplayOrder__c {
                  value
                }
                Acc_QuestionScore__c {
                  value
                }
                Acc_QuestionText__c {
                  value
                }
                Acc_QuestionDescription__c {
                  value
                }
                Acc_ActiveFlag__c {
                  value
                }
                Acc_ScoredQuestion__c {
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
              }
            }
          }
        }
      }
    }
  }
`;
