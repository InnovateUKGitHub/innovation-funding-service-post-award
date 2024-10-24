import { graphql } from "react-relay";

export const projectSuspensionMessageFragment = graphql`
  fragment ProjectSuspensionMessageFragment on UIAPI {
    query {
      ProjectSuspensionProject: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
        edges {
          node {
            Id
            Acc_ProjectStatus__c {
              value
            }
            roles {
              isPm
              isFc
              isMo
              isAssociate
              isSalesforceSystemUser
              partnerRoles {
                isFc
                isMo
                isPm
                isSalesforceSystemUser
                isAssociate
                partnerId
              }
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
