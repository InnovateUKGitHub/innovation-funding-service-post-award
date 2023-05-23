import { graphql } from "react-relay";

export const projectDocumentsQuery = graphql`
  query ProjectDocumentsQuery($projectId: ID!) {
    currentUser {
      email
    }
    salesforce {
      uiapi {
        query {
          Acc_ProjectParticipant__c(
            where: { Acc_ProjectId__c: { eq: $projectId } }
            orderBy: { Acc_AccountId__r: { Name: { order: ASC } } }
            first: 200
          ) {
            edges {
              node {
                Id
                Acc_AccountId__c {
                  value
                }
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                Acc_ProjectRole__c {
                  value
                }
                ContentDocumentLinks(first: 2000, orderBy: { ContentDocument: { LastModifiedDate: { order: DESC } } }) {
                  edges {
                    node {
                      ContentDocument {
                        Id
                        LastModifiedBy {
                          ContactId {
                            value
                          }
                        }
                        LatestPublishedVersionId {
                          value
                        }
                        Description {
                          value
                        }
                        ContentSize {
                          value
                        }
                        CreatedDate {
                          value
                        }
                        FileType {
                          value
                        }
                        FileExtension {
                          value
                        }
                        Title {
                          value
                        }
                        LastModifiedDate {
                          value
                        }
                        CreatedBy {
                          Username {
                            value
                          }
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
          Acc_Project__c(first: 1, where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                roles {
                  isMo
                  isFc
                  isPm
                  partnerRoles {
                    isFc
                    isMo
                    isPm
                    partnerId
                  }
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                ContentDocumentLinks(first: 2000) {
                  edges {
                    node {
                      ContentDocument {
                        Id
                        LastModifiedBy {
                          ContactId {
                            value
                          }
                        }
                        LatestPublishedVersionId {
                          value
                        }
                        Description {
                          value
                        }
                        ContentSize {
                          value
                        }
                        CreatedDate {
                          value
                        }
                        FileType {
                          value
                        }
                        FileExtension {
                          value
                        }
                        Title {
                          value
                        }
                        LastModifiedDate {
                          value
                        }
                        CreatedBy {
                          Username {
                            value
                          }
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
  }
`;
