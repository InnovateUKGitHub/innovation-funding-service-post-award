import { graphql } from "react-relay";
export const projectSetupSpendProfileQuery = graphql`
  query ProjectSetupSpendProfileQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...NewForecastTableFragment
        ...PageFragment
        query {
          Acc_ProjectParticipant__c(where: { Id: { eq: $partnerId } }) {
            edges {
              node {
                Id
                Acc_SpendProfileCompleted__c {
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
