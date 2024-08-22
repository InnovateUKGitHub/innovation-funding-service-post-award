import { graphql } from "relay-runtime";

const manageTeamMembersDashboardQuery = graphql`
  query ManageTeamMembersDashboardQuery($projectId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                Acc_ProjectParticipantsProject__r(first: 500) {
                  edges {
                    node {
                      Id
                      Acc_AccountId__r {
                        Id
                        Name {
                          value
                        }
                      }
                    }
                  }
                }
                Project_Contact_Links__r(
                  orderBy: { Acc_AccountId__r: { Name: { order: ASC, nulls: LAST } } }
                  first: 2000
                ) {
                  edges {
                    node {
                      Id
                      Acc_ContactId__r {
                        Id
                        Name {
                          value
                        }
                      }
                      Acc_AccountId__c {
                        value
                      }
                      Acc_Role__c {
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
    }
  }
`;

export { manageTeamMembersDashboardQuery };
