import { graphql } from "react-relay";

export const jesSearchQuery = graphql`
  query JesSearchQuery($search: String!) {
    salesforce {
      uiapi {
        query {
          Account(where: { and: [{ JES_Organisation__c: { eq: "Yes" } }, { Name: { like: $search } }] }, first: 1000) {
            edges {
              node {
                Id
                Name {
                  value
                }
                JES_Organisation__c {
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
