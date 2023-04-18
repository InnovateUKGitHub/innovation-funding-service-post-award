import { graphql } from "react-relay";

const pcrDashboardQuery = graphql`
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
                Project_Change_Requests__r(first: 2000, orderBy: { Acc_RequestNumber__c: { order: DESC } }) {
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

export { pcrDashboardQuery };
