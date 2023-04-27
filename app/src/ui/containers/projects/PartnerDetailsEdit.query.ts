import { graphql } from "relay-hooks";

export const partnerDetailsEditQuery = graphql`
  query PartnerDetailsEditQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                isActive
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
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
