import { graphql } from "react-relay";

const pcrDashboardQuery = graphql`
  query PCRDashboardQuery($projectId: ID) {
    salesforce {
      uiapi {
        ...PageFragment
        ...ProjectSuspensionMessageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                isActive
                Acc_CompetitionType__c {
                  value
                }
                Acc_ProjectParticipantsProject__r {
                  totalCount
                }
              }
            }
          }
          Acc_ProjectChangeRequest__c(
            first: 2000
            where: {
              Acc_Project__c: { eq: $projectId }
              RecordType: {
                or: [
                  { DeveloperName: { eq: "Acc_RequestHeader" } }
                  { DeveloperName: { eq: "Acc_Request_Header_Manage_Team_Members" } }
                ]
              }
            }
            orderBy: { Acc_RequestNumber__c: { order: DESC } }
          ) {
            edges {
              node {
                Id
                Acc_Status__c {
                  value
                }
                Acc_Manage_Team_Member_Status__c {
                  value
                }
                Acc_RequestHeader__c {
                  value
                }
                Acc_RequestNumber__c {
                  value
                }
                CreatedDate {
                  value
                }
                Acc_Status__c {
                  value
                }
                LastModifiedDate {
                  value
                }
                Acc_Project__c {
                  value
                }
                Acc_Project_Change_Requests__r(first: 2000, orderBy: { Acc_RequestNumber__c: { order: DESC } }) {
                  edges {
                    node {
                      Id
                      RecordType {
                        DeveloperName {
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
  }
`;

export { pcrDashboardQuery };
