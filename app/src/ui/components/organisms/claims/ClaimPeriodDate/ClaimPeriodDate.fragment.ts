import { graphql } from "react-relay";

export const claimPeriodDateFragment = graphql`
  fragment ClaimPeriodDateFragment on UIAPI {
    query {
      ClaimPeriodDate_Claims: Acc_Claims__c(
        where: {
          and: [
            { Acc_ProjectID__c: { eq: $projectIdStr } }
            { Acc_ProjectParticipant__c: { eq: $partnerId } }
            { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
            { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
          ]
        }
        first: 2000
        orderBy: { Acc_ProjectParticipant__r: { Acc_AccountId__r: { Name: { order: ASC } } } }
      ) {
        edges {
          node {
            Id
            RecordType {
              DeveloperName {
                value
              }
            }
            Acc_ProjectPeriodEndDate__c {
              value
            }
            Acc_ProjectPeriodStartDate__c {
              value
            }
            Acc_ProjectPeriodNumber__c {
              value
            }
          }
        }
      }
      ClaimPeriodDate_ProjectParticipant: Acc_ProjectParticipant__c(
        where: { and: [{ Acc_ProjectId__c: { eq: $projectId } }, { Id: { eq: $partnerId } }] }
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
            Acc_ParticipantStatus__c {
              value
            }
          }
        }
      }
    }
  }
`;
