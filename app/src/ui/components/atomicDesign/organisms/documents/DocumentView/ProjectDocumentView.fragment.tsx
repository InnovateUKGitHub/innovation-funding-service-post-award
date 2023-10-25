import { graphql } from "react-relay";

export const projectDocumentViewFragment = graphql`
  fragment ProjectDocumentViewFragment on UIAPI {
    query {
      ProjectDocumentView_Project: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
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
      ProjectDocumentView_Partner: Acc_ProjectParticipant__c(where: { Id: { eq: $partnerId } }, first: 2000) {
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
                  isOwner
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
`;
