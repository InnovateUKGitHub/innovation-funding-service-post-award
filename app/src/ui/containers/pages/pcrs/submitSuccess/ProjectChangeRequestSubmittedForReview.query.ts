import { graphql } from "relay-runtime";

const projectChangeRequestSubmittedForReviewQuery = graphql`
  query ProjectChangeRequestSubmittedForReviewQuery($projectId: ID!, $pcrId: ID!) {
    currentUser {
      email
      isSystemUser
    }
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_NumberofPeriods__c {
                  value
                }
              }
            }
          }
          Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrId }, Acc_Project__c: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Acc_RequestNumber__c {
                  value
                }
                Acc_Status__c {
                  value
                }
                CreatedDate {
                  value
                }
                Acc_LastUpdated__c {
                  value
                }
                Acc_Project_Change_Requests__r {
                  edges {
                    node {
                      Id
                      RecordType {
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

export { projectChangeRequestSubmittedForReviewQuery };
