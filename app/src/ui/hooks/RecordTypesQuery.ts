import { graphql } from "react-relay";

export const recordTypesQuery = graphql`
  query RecordTypesQuery {
    salesforce {
      uiapi {
        query {
          RecordType {
            edges {
              node {
                Id
                Name {
                  value
                }
                SobjectType {
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
