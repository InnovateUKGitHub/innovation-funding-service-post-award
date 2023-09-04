import { graphql } from "react-relay";

const pcrReasoningWorkflowQuery = graphql`
  query PcrReasoningWorkflowQuery($projectId: ID, $pcrId: ID) {
    currentUser {
      email
    }
    salesforce {
      uiapi {
        query {
          Acc_ProjectChangeRequest__c(
            where: { or: [{ Id: { eq: $pcrId } }, { Acc_RequestHeader__c: { eq: $pcrId } }] }
          ) {
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
                ContentDocumentLinks(first: 2000) {
                  edges {
                    node {
                      LinkedEntityId {
                        value
                      }
                      isFeedAttachment
                      ContentDocument {
                        Id
                        LastModifiedBy {
                          ContactId {
                            value
                          }
                        }
                        Description {
                          value
                        }
                        CreatedDate {
                          value
                        }
                        LatestPublishedVersionId {
                          value
                        }
                        FileExtension {
                          value
                        }
                        Title {
                          value
                        }
                        ContentSize {
                          value
                        }
                        CreatedBy {
                          Name {
                            value
                          }
                          Username {
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
              }
            }
          }
        }
      }
    }
  }
`;

export { pcrReasoningWorkflowQuery };
