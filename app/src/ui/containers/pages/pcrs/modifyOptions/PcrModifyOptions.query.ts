import { graphql } from "relay-runtime";

const pcrModifyOptionsQuery = graphql`
  query PcrModifyOptionsQuery($projectId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                isActive
                Acc_CompetitionType__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectNumber__c {
                  value
                }
              }
            }
          }
          Acc_ProjectParticipant__c(where: { Acc_ProjectId__c: { eq: $projectId } }, first: 2000) {
            totalCount
          }
          Acc_ProjectChangeRequest__c(where: { Acc_Project__c: { eq: $projectId } }, first: 2000) {
            edges {
              node {
                Id
                Acc_RequestHeader__c {
                  value
                }
                Acc_Status__c {
                  value
                }
                RecordType {
                  Name {
                    value
                    label
                  }
                  DeveloperName {
                    value
                  }
                  Id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { pcrModifyOptionsQuery };
