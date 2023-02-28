import { graphql } from "relay-runtime";

const projectDocumentsQuery = graphql`
  query ProjectDocumentsQuery($projectId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_ProjectParticipant__c(where: { Acc_ProjectId__c: { eq: $projectId } }) {
            edges {
              node {
                Id
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                ContentDocumentLinks(first: 2000) {
                  ...NewDocumentsTableFragment
                }
              }
            }
          }
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectNumber__c {
                  value
                }
                ContentDocumentLinks(first: 2000) {
                  ...NewDocumentsTableFragment
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { projectDocumentsQuery };
