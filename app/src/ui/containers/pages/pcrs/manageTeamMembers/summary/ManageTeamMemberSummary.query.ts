import { graphql } from "relay-runtime";

const manageTeamMemberSummaryQuery = graphql`
  query ManageTeamMemberSummaryQuery($pcrId: ID!, $pcrItemId: ID!) {
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
                Acc_Manage_Team_Member_Status__c {
                  value
                }
                Acc_Status__c {
                  value
                }
              }
            }
          }
          Item: Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrItemId } }, first: 1) {
            edges {
              node {
                Acc_Type__c {
                  value
                }
                Acc_Start_Date__c {
                  value
                }
                Acc_Role__c {
                  value
                }
                Acc_Email__c {
                  value
                }
                Acc_First_Name__c {
                  value
                }
                Acc_Last_Name__c {
                  value
                }
                Acc_ProjectContactLink__r {
                  Id
                  Acc_ContactId__r {
                    Id
                    Name {
                      value
                    }
                    FirstName {
                      value
                    }
                    LastName {
                      value
                    }
                  }
                  Acc_EndDate__c {
                    value
                  }
                  Acc_Role__c {
                    value
                  }
                  Acc_EmailOfSFContact__c {
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

export { manageTeamMemberSummaryQuery };
