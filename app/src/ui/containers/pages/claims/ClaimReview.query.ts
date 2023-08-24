import { graphql } from "react-relay";
export const claimReviewQuery = graphql`
  query ClaimReviewQuery($projectId: ID!, $projectIdStr: String, $partnerId: ID!, $periodId: Double!) {
    currentUser {
      userId
    }
    salesforce {
      uiapi {
        ...TitleFragment
        ...ClaimPeriodDateFragment
        ...ClaimTableFragment
        ...ForecastTableFragment
        ...StatusChangesLogsFragment
        ...DocumentViewFragment @arguments(documentRecordType: "Total Project Period")
        query {
          Claims: Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
                { RecordType: { Name: { eq: "Total Project Period" } } }
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
                Acc_FinalClaim__c {
                  value
                }
              }
            }
          }
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                roles {
                  isMo
                  isFc
                  isPm
                }
                Acc_CompetitionId__r {
                  Name {
                    value
                  }
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Impact_Management_Participation__c {
                  value
                }
                Impact_Management_Participation__c {
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
