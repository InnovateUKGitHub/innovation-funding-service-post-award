import { graphql } from "relay-runtime";

const newDocumentsTableFragment = graphql`
  fragment NewDocumentsTableFragment on ContentDocumentLinkConnection {
    edges {
      node {
        ContentDocument {
          Title {
            value
          }
          FileType {
            value
          }
        }
      }
    }
  }
`;

export { newDocumentsTableFragment }
