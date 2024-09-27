import { graphql } from "react-relay";

export const pcrDeleteQuery = graphql`
  query PcrDeleteQuery($projectId: ID!, $pcrId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
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
