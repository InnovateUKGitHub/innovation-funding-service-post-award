import { graphql } from "react-relay";

export const pcrPrepareQuery = graphql`
  query ProjectChangeRequestPrepareQuery($projectId: ID!, $pcrId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
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
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                roles {
                  isFc
                  isMo
                  isPm
                  isAssociate
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_CompetitionId__r {
                  Acc_TypeofAid__c {
                    value
                  }
                }
                Acc_MonitoringLevel__c {
                  value
                }
                Acc_ProjectParticipantsProject__r {
                  totalCount
                }
              }
            }
          }
          OtherPCRs: Acc_ProjectChangeRequest__c(
            first: 2000
            where: {
              Acc_Project__c: { eq: $projectId }
              Acc_Status__c: { nin: ["Actioned", "Approved", "Withdrawn", "Rejected"] }
            }
            orderBy: { Acc_RequestNumber__c: { order: DESC } }
          ) {
            edges {
              node {
                Id
                Acc_Status__c {
                  value
                }
                Acc_Project_Change_Requests__r(first: 2000) {
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
          Acc_ProjectChangeRequest__c(
            first: 1
            where: {
              Id: { eq: $pcrId }
              Acc_Project__c: { eq: $projectId }
              RecordType: {
                or: [
                  { DeveloperName: { eq: "Acc_RequestHeader" } }
                  { DeveloperName: { eq: "Acc_Request_Header_Manage_Team_Members" } }
                ]
              }
            }
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
                      Acc_Comments__c {
                        value
                      }
                      Acc_Status__c {
                        value
                      }
                      Acc_MarkedasComplete__c {
                        value
                      }
                      Acc_NewOrganisationName__c {
                        value
                      }
                      Acc_OtherFunding__c {
                        value
                      }
                      Acc_CommercialWork__c {
                        value
                      }
                      Acc_OrganisationName__c {
                        value
                      }
                      Acc_ParticipantType__c {
                        value
                      }
                      Acc_ExistingPartnerName__c {
                        value
                      }
                      Acc_ProjectRole__c {
                        value
                      }
                      Acc_Project__c {
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
