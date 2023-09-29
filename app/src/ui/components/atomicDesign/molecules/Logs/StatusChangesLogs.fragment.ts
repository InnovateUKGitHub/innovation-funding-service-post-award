import { graphql } from "react-relay";

export const statusChangesLogsFragment = graphql`
  fragment StatusChangesLogsFragment on UIAPI @argumentDefinitions(allPeriods: { type: Boolean, defaultValue: false }) {
    query {
      StatusChanges_Project: Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
        edges {
          node {
            Id
            Acc_CompetitionType__c {
              value
            }
            roles {
              isFc
              isPm
              isMo
            }
          }
        }
      }
      ... @include(if: $allPeriods) {
        StatusChanges_StatusChanges: Acc_StatusChange__c(
          where: { Acc_Claim__r: { Acc_ProjectParticipant__c: { eq: $partnerId } } }
          orderBy: { CreatedDate: { order: DESC } }
          first: 2000
        ) {
          edges {
            node {
              Id
              Acc_NewClaimStatus__c {
                value
              }
              Acc_ExternalComment__c {
                value
              }
              Acc_ParticipantVisibility__c {
                value
              }
              Acc_CreatedByAlias__c {
                value
              }
              CreatedDate {
                value
              }
            }
          }
        }
      }
      ... @skip(if: $allPeriods) {
        StatusChanges_StatusChanges: Acc_StatusChange__c(
          where: {
            Acc_Claim__r: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
              ]
            }
          }
          orderBy: { CreatedDate: { order: DESC } }
          first: 2000
        ) {
          edges {
            node {
              Id
              Acc_NewClaimStatus__c {
                value
              }
              Acc_ExternalComment__c {
                value
              }
              Acc_ParticipantVisibility__c {
                value
              }
              Acc_CreatedByAlias__c {
                value
              }
              CreatedDate {
                value
              }
            }
          }
        }
      }
    }
  }
`;
