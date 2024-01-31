import { graphql } from "relay-runtime";

const upliftSummaryQuery = graphql`
  query UpliftSummaryQuery($pcrId: ID!, $pcrItemId: ID!) {
    salesforce {
      uiapi {
        query {
          Header: Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrId } }, first: 1) {
            edges {
              node {
                Acc_RequestNumber__c {
                  value
                }
              }
            }
          }
          Child: Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrItemId } }, first: 1) {
            edges {
              node {
                Acc_Reasoning__c {
                  value
                }
              }
            }
          }
          Documents: ContentDocumentLink(
            where: { LinkedEntityId: { in: [$pcrId, $pcrItemId] } }
            first: 2000
            orderBy: { ContentDocument: { CreatedDate: { order: DESC } } }
          ) {
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
  }
`;

export { upliftSummaryQuery };
