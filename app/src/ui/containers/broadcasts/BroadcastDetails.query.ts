import { graphql } from "relay-hooks";

export const broadcastDetailsQuery = graphql`
  query BroadcastDetailsQuery($broadcastId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_BroadcastMessage__c(where: { Id: { eq: $broadcastId } }) {
            edges {
              node {
                Acc_StartDate__c {
                  value
                }
                Acc_EndDate__c {
                  value
                }
                Acc_Message__c {
                  value
                }
                Id
                DisplayValue
              }
            }
          }
        }
      }
    }
  }
`;
