import { graphql } from "relay-runtime";

export const changeRemainingGrantQuery = graphql`
  query ChangeRemainingGrantQuery($projectId: ID, $pcrItemId: ID) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_VirementsForParticipant: Acc_Virements__c(
            where: {
              Acc_ProjectChangeRequest__c: { eq: $pcrItemId }
              RecordType: { DeveloperName: { eq: "Acc_VirementsForParticipant" } }
            }
            first: 200
          ) {
            edges {
              node {
                Id
                Acc_ProjectParticipant__c {
                  value
                }
                Acc_ProjectChangeRequest__c {
                  value
                }
                Acc_NewAwardRate__c {
                  value
                }
                Acc_CurrentAwardRate__c {
                  value
                }
                Acc_NewTotalEligibleCosts__c {
                  value
                }
                Acc_NewRemainingGrant__c {
                  value
                }
              }
            }
          }

          Acc_VirementsForCosts: Acc_Virements__c(
            where: {
              Acc_ParticipantVirement__r: { Acc_ProjectChangeRequest__c: { eq: $pcrItemId } }
              RecordType: { DeveloperName: { eq: "Acc_VirementsForCosts" } }
            }
            orderBy: { Acc_Profile__r: { Acc_CostCategory__r: { Acc_DisplayOrder__c: { order: ASC } } } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_ParticipantVirement__c {
                  value
                }
                Acc_CurrentCosts__c {
                  value
                }
                Acc_ClaimedCostsToDate__c {
                  value
                }
                Acc_NewCosts__c {
                  value
                }
              }
            }
          }

          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Acc_NonFEC__c {
                  value
                }
                roles {
                  isMo
                  isFc
                  isPm
                  isAssociate
                  isSalesforceSystemUser
                }
                Acc_CompetitionType__c {
                  value
                }
              }
            }
          }

          Acc_ProjectParticipant__c(
            where: { Acc_ProjectId__c: { eq: $projectId } }
            orderBy: { Acc_AccountId__r: { Name: { order: ASC } } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                Acc_ProjectRole__c {
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
