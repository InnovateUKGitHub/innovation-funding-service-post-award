import { graphql } from "relay-hooks";

export const pcrTimeExtensionWorkflowQuery = graphql`
  query PcrTimeExtensionWorkflowQuery($projectId: ID!, $pcrItemId: ID!) {
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
                Acc_ProjectStatus__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_EndDate__c {
                  value
                }
                Acc_StartDate__c {
                  value
                }
                Project_Change_Requests__r(first: 2000, where: { Id: { eq: $pcrItemId } }) {
                  edges {
                    node {
                      Id
                      Acc_AdditionalNumberofMonths__c {
                        value
                      }
                      Acc_ExistingProjectDuration__c {
                        value
                      }
                      Acc_Project__c {
                        value
                      }
                      Acc_MarkedasComplete__c {
                        value
                      }
                      Acc_RequestHeader__c {
                        value
                      }
                      Acc_RequestNumber__c {
                        value
                      }
                      Acc_Status__c {
                        value
                      }
                      CreatedDate {
                        value
                      }
                      LastModifiedDate {
                        value
                      }
                      RecordType {
                        Name {
                          value
                          label
                        }
                        DeveloperName {
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
