import { graphql } from "relay-hooks";

const pcrDashboardQuery = graphql`
  # Welcome to Altair GraphQL Client.
  # You can send your request using CmdOrCtrl + Enter.

  # Enter your graphQL query here.
  query PCRDashboardQuery($projectId: ID) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                isActive
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
                Project_Change_Requests__r(first: 2000) {
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
                      CreatedDate {
                        value
                      }
                      Acc_Status__c {
                        value
                      }
                      LastModifiedDate {
                        value
                      }
                      RecordType {
                        Name {
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

export { pcrDashboardQuery };
