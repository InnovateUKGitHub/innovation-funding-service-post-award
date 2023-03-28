import { graphql } from "react-relay";

export const documentSummaryFragment = graphql`
  fragment DocumentSummaryFragment on ContentDocumentLinkConnection {
    edges {
      node {
        ContentDocument {
          Id
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
`;
