import { graphql } from "react-relay";

const pcrReasoningWorkflowQuery = graphql`
  query PcrReasoningWorkflowQuery($projectId: ID, $pcrId: ID) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          PcrHeader: Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrId } }, first: 1) {
            edges {
              node {
                Id
                ContentDocumentLinks(first: 2000, orderBy: { ContentDocument: { CreatedDate: { order: DESC } } }) {
                  edges {
                    node {
                      LinkedEntityId {
                        value
                      }
                      isFeedAttachment
                      isOwner
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
                          Id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          Acc_ProjectChangeRequest__c(
            where: { or: [{ Id: { eq: $pcrId } }, { Acc_RequestHeader__c: { eq: $pcrId } }] }
            first: 2000
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
                Acc_MarkedasComplete__c {
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
`;

export { pcrReasoningWorkflowQuery };
