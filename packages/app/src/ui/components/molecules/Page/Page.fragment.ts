import { graphql } from "react-relay";

export const pageFragment = graphql`
  fragment PageFragment on UIAPI {
    query {
      Page: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
        edges {
          node {
            Id
            isActive
            roles {
              isMo
              isFc
              isPm
              isAssociate
              isSalesforceSystemUser
              partnerRoles {
                isMo
                isFc
                isPm
                isAssociate
                isSalesforceSystemUser
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
            Acc_ProjectParticipantsProject__r(first: 200) {
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
