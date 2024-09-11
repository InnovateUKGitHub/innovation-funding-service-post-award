import { graphql } from "relay-runtime";

const manageTeamMemberSummaryQuery = graphql`
  query ManageTeamMemberSummaryQuery($pcrId: ID!) {
    salesforce {
      uiapi {
        query {
          Header: Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrId } }, first: 1) {
            edges {
              node {
                Acc_RequestNumber__c {
                  value
                }
                Acc_Project_Change_Requests__r {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { manageTeamMemberSummaryQuery };
