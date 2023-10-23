import { graphql } from "react-relay";

export const projectSetupBankStatementQuery = graphql`
  query ProjectSetupBankStatementQuery($projectId: ID!, $partnerId: ID!) {
    currentUser {
      userId
    }
    salesforce {
      uiapi {
        ...TitleFragment
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
                  partnerRoles {
                    isMo
                    isFc
                    isPm
                    partnerId
                  }
                }
                Acc_ProjectStatus__c {
                  value
                }
              }
            }
          }
          Acc_ProjectParticipant__c(where: { Id: { eq: $partnerId } }) {
            edges {
              node {
                Id
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                Acc_AccountId__c {
                  value
                }
                ContentDocumentLinks(first: 2000, orderBy: { ContentDocument: { LastModifiedDate: { order: DESC } } }) {
                  edges {
                    node {
                      isFeedAttachment
                      LinkedEntityId {
                        value
                      }
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
                          Id
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
