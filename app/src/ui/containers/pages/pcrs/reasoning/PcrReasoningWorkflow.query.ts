import { graphql } from "react-relay";

const pcrReasoningWorkflowQuery = graphql`
  query PcrReasoningWorkflowQuery($projectId: ID, $pcrId: ID) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Project_Change_Requests__r(where: { Id: { eq: $pcrId } }) {
                  edges {
                    node {
                      Id
                      Acc_Status__c {
                        value
                      }
                      Acc_RequestHeader__c {
                        value
                      }
                      Acc_RequestNumber__c {
                        value
                      }
                      Acc_Reasoning__c {
                        value
                      }
                      Acc_Project__c {
                        value
                      }
                      RecordType {
                        Name {
                          value
                          label
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

export { pcrReasoningWorkflowQuery };
