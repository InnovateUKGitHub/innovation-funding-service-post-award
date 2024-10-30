import { graphql } from "react-relay";

export const partnerDetailsQuery = graphql`
  query PartnerDetailsQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                roles {
                  isMo
                  isFc
                  isPm
                  isAssociate
                  isSalesforceSystemUser
                  partnerRoles {
                    isFc
                    isMo
                    isPm
                    isAssociate
                    partnerId
                  }
                }
                Acc_ProjectParticipantsProject__r(where: { Id: { eq: $partnerId } }) {
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
                      Acc_ParticipantType__c {
                        value
                      }
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
