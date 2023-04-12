import { graphql } from "relay-runtime";

const userSwitcherCurrentUserQuery = graphql`
  query UserSwitcherCurrentUserQuery {
    currentUser {
      email
      isSystemUser
    }
  }
`;

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
            first: 2000
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
                Project_Contact_Links__r(orderBy: { Acc_ContactId__r: { Name: { order: ASC } } }, first: 2000) {
                  edges {
                    node {
                      Acc_EmailOfSFContact__c {
                        value
                      }
                      Acc_ContactId__r {
                        Name {
                          value
                        }
                        Email {
                          value
                        }
                      }
                      Acc_UserId__r {
                        Name {
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

export { userSwitcherCurrentUserQuery, userSwitcherProjectsQuery, userSwitcherProjectQuery };
