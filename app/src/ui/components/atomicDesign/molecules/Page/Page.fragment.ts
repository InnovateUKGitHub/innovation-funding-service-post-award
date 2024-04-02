import { graphql } from "react-relay";

export const pageFragment = graphql`
  fragment PageFragment on UIAPI {
    query {
      Page: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
        edges {
          node {
            isActive
            roles {
              isMo
              isFc
              isPm
              isAssociate
              partnerRoles {
                isMo
                isFc
                isPm
                isAssociate
                partnerId
              }
            }
            Acc_ProjectNumber__c {
              value
            }
            Acc_ProjectTitle__c {
              value
            }
            Acc_ProjectStatus__c {
              value
            }
            Acc_ProjectParticipantsProject__r {
              edges {
                node {
                  Id
                  Acc_ParticipantStatus__c {
                    value
                  }
                  Acc_FlaggedParticipant__c {
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
`;
