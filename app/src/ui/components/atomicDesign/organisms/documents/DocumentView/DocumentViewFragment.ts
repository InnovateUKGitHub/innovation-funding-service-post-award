import { graphql } from "react-relay";

export const documentViewFragment = graphql`
  fragment DocumentViewFragment on UIAPI @argumentDefinitions(documentRecordType: { type: "String!" }) {
    query {
      DocumentView_Claims: Acc_Claims__c(
        where: {
          and: [
            { Acc_ProjectID__c: { eq: $projectIdStr } }
            { Acc_ProjectParticipant__c: { eq: $partnerId } }
            { RecordType: { Name: { eq: $documentRecordType } } }
          ]
        }
        first: 2000
        orderBy: { Acc_ProjectParticipant__r: { Acc_AccountId__r: { Name: { order: ASC } } } }
      ) {
        edges {
          node {
            Id
            Acc_ProjectPeriodNumber__c {
              value
            }
            Acc_CostCategory__c {
              value
            }
            RecordType {
              Name {
                value
              }
            }
            ContentDocumentLinks(first: 2000, orderBy: { ContentDocument: { CreatedDate: { order: DESC } } }) {
              edges {
                node {
                  Id
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
    }
  }
`;
