import { graphql } from "react-relay";

export const forecastTileQuery = graphql`
  query ForecastTileQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        ...NewForecastTableFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                isActive
              }
            }
          }
          Acc_ProjectParticipant__c(where: { Id: { eq: $partnerId } }, first: 1) {
            edges {
              node {
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                Acc_NewForecastNeeded__c {
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
    }
  }
`;
