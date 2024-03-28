import { graphql } from "react-relay";

export const partnerDetailsEditQuery = graphql`
  query PartnerDetailsEditQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Acc_ProjectParticipantsProject__r(where: { Id: { eq: $partnerId } }) {
                  edges {
                    node {
                      Id
                      Acc_ParticipantStatus__c {
                        value
                      }
                      Acc_Postcode__c {
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
