import { graphql } from "relay-runtime";

const claimForecastQuery = graphql`
  query ClaimForecastQuery($projectId: ID!, $projectParticipantId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        ...NewForecastTableFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Acc_NumberofPeriods__c {
                  value
                }
                roles {
                  isFc
                  isPm
                  isMo
                  isAssociate
                }
              }
            }
          }
          Acc_ProjectParticipant__c(where: { Id: { eq: $projectParticipantId } }, first: 1) {
            edges {
              node {
                Acc_ForecastLastModifiedDate__c {
                  value
                }
                Acc_OverheadRate__c {
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

export { claimForecastQuery };
