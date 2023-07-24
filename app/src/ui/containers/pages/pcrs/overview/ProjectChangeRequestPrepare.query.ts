import { graphql } from "react-relay";

export const pcrPrepareQuery = graphql`
  query ProjectChangeRequestPrepareQuery($projectId: ID!, $pcrId: ID!) {
    salesforce {
      uiapi {
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
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_CompetitionId__r {
                  Acc_TypeofAid__c {
                    value
                  }
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_MonitoringLevel__c {
                  value
                }
                Acc_ProjectParticipantsProject__r(first: 2000) {
                  edges {
                    node {
                      Id
                    }
                  }
                }
                Project_Change_Requests__r(first: 2000) {
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
                      Acc_RequestHeader__c {
                        value
                      }
                      Acc_RequestNumber__c {
                        value
                      }
                      Acc_ParticipantType__c {
                        value
                      }
                      Acc_ExistingPartnerName__c {
                        value
                      }
                      Acc_Status__c {
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
