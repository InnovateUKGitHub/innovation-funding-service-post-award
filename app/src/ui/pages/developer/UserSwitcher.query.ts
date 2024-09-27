import { graphql } from "relay-runtime";

const userSwitcherProjectsQuery = graphql`
  query UserSwitcherProjectsQuery($search: String) {
    salesforce(login: "system") {
      uiapi {
        query {
          Acc_Project__c(
            orderBy: {
              Acc_CompetitionId__r: { Acc_CompetitionType__c: { order: ASC } }
              Acc_ProjectNumber__c: { order: ASC }
            }
            where: {
              or: {
                Acc_ProjectTitle__c: { like: $search }
                Acc_ProjectNumber__c: { like: $search }
                Acc_LeadParticipantName__c: { like: $search }
                Acc_CompetitionType__c: { like: $search }
              }
            }
            first: 100
          ) {
            totalCount
            edges {
              node {
                Id
                Acc_CompetitionId__r {
                  Acc_CompetitionType__c {
                    displayValue
                  }
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
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

const userSwitcherProjectQuery = graphql`
  query UserSwitcherProjectQuery($projectId: ID) {
    salesforce(login: "system") {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Acc_ProjectTitle__c {
                  value
                }
                Project_Contact_Links__r(orderBy: { Acc_ContactId__r: { Name: { order: ASC } } }, first: 2000) {
                  edges {
                    node {
                      Acc_ContactId__r {
                        Id
                        Name {
                          value
                        }
                        username
                      }
                      Acc_UserId__r {
                        Name {
                          value
                        }
                        Username {
                          value
                        }
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

export { userSwitcherProjectsQuery, userSwitcherProjectQuery };
