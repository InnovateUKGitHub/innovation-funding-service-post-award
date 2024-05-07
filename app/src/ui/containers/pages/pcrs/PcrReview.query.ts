import { graphql } from "react-relay";

export const pcrReviewQuery = graphql`
  query PcrReviewQuery($projectId: ID!, $pcrId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                roles {
                  isFc
                  isMo
                  isPm
                  isAssociate
                }
                Acc_CompetitionId__r {
                  Acc_TypeofAid__c {
                    value
                  }
                }
              }
            }
          }
          Acc_ProjectChangeRequest__c(
            first: 2000
            where: { Acc_Project__c: { eq: $projectId }, RecordType: { DeveloperName: { eq: "Acc_RequestHeader" } } }
            orderBy: { Acc_RequestNumber__c: { order: DESC } }
          ) {
            edges {
              node {
                Id
                Acc_Status__c {
                  value
                }
                Acc_RequestHeader__c {
                  value
                }
                Acc_RequestNumber__c {
                  value
                }
                Acc_MarkedasComplete__c {
                  value
                }
                Acc_Comments__c {
                  value
                }
                Acc_Project_Change_Requests__r(first: 2000) {
                  edges {
                    node {
                      Id
                      Acc_MarkedasComplete__c {
                        value
                      }
                      Acc_RequestHeader__c {
                        value
                      }
                      Acc_RequestNumber__c {
                        value
                      }
                      Acc_ParticipantType__c {
                        value
                      }
                      Acc_ProjectRole__c {
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
          Acc_StatusChange__c(
            where: {
              and: [
                { Acc_ProjectChangeRequest__r: { Acc_Project__c: { eq: $projectId } } }
                { Acc_ProjectChangeRequest__c: { eq: $pcrId } }
              ]
            }
            orderBy: { CreatedDate: { order: DESC } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_ProjectChangeRequest__c {
                  value
                }
                Acc_PreviousProjectChangeRequestStatus__c {
                  value
                }
                CreatedDate {
                  value
                }
                Acc_CreatedByAlias__c {
                  value
                }
                Acc_NewProjectChangeRequestStatus__c {
                  value
                }
                Acc_ExternalComment__c {
                  value
                }
                Acc_ParticipantVisibility__c {
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