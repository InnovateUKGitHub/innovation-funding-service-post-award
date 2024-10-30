import { graphql } from "react-relay";

export const initialContentQuery = graphql`
  query InitialContentQuery($projectId: ID) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                Acc_CompetitionType__c {
                  value
                }
                Acc_MonitoringLevel__c {
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
