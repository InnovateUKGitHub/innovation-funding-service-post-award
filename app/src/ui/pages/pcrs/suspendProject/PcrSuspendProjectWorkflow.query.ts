import { graphql } from "react-relay";

export const pcrSuspendProjectWorkflowQuery = graphql`
  query PcrSuspendProjectWorkflowQuery($projectId: ID!, $pcrItemId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                roles {
                  isPm
                  isFc
                  isMo
                  isAssociate
                }
                Project_Change_Requests__r(first: 2000, where: { Id: { eq: $pcrItemId } }) {
                  edges {
                    node {
                      Id
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
                      Acc_SuspensionStarts__c {
                        value
                      }
                      Acc_SuspensionEnds__c {
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
