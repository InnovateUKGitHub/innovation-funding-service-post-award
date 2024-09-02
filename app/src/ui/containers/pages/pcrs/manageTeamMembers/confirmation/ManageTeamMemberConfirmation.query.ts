import { graphql } from "relay-runtime";

export const manageTeamMemberConfirmationQuery = graphql`
  query ManageTeamMemberConfirmationQuery($projectId: ID!, $pcrId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_ProjectChangeRequest__c(first: 1, where: { Id: { eq: $pcrId } }) {
            edges {
              node {
                Id
                Acc_RequestNumber__c {
                  value
                }
                Acc_Status__c {
                  value
                }
                LastModifiedDate {
                  value
                }
                CreatedDate {
                  value
                }
                RecordType {
                  DeveloperName {
                    value
                  }
                  Name {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
