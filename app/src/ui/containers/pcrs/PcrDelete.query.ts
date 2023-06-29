import { graphql } from "relay-hooks";

export const pcrDeleteQuery = graphql`
  query PcrDeleteQuery($projectId: ID!, $pcrId: ID!) {
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
                Project_Change_Requests__r(
                  first: 2000
                  where: { or: [{ Id: { eq: $pcrId } }, { Acc_RequestHeader__c: { eq: $pcrId } }] }
                ) {
                  edges {
                    node {
                      Id
                      Acc_RequestHeader__c {
                        value
                      }
                      Acc_RequestNumber__c {
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
