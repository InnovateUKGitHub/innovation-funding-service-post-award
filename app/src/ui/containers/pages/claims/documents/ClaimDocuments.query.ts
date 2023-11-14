import { graphql } from "react-relay";

export const claimDocumentsQuery = graphql`
  query ClaimDocumentsQuery($projectId: ID!, $partnerId: ID!, $periodId: Double) {
    salesforce {
      uiapi {
        query {
          Acc_Claims__c(
            where: {
              Acc_ProjectParticipant__c: { eq: $partnerId }
              Acc_ProjectPeriodNumber__c: { eq: $periodId }
              RecordType: { DeveloperName: { eq: "Total_Project_Period" } }
            }
            first: 1
          ) {
            edges {
              node {
                Id
                Acc_FinalClaim__c {
                  value
                }
                Acc_FinalClaim__c {
                  value
                }
                Acc_IARRequired__c {
                  value
                }
                Acc_PCF_Status__c {
                  value
                }
                Impact_Management_Participation__c {
                  value
                }
                ContentDocumentLinks(first: 2000, orderBy: { ContentDocument: { LastModifiedDate: { order: DESC } } }) {
                  edges {
                    node {
                      isFeedAttachment
                      isOwner
                      LinkedEntityId {
                        value
                      }
                      ContentDocument {
                        Id
                        LastModifiedBy {
                          ContactId {
                            value
                          }
                        }
                        LatestPublishedVersionId {
                          value
                        }
                        Description {
                          value
                        }
                        ContentSize {
                          value
                        }
                        CreatedDate {
                          value
                        }
                        FileType {
                          value
                        }
                        FileExtension {
                          value
                        }
                        Title {
                          value
                        }
                        LastModifiedDate {
                          value
                        }
                        CreatedBy {
                          Id
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
          Acc_Project__c(first: 1, where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                roles {
                  isMo
                  isFc
                  isPm
                  partnerRoles {
                    isFc
                    isMo
                    isPm
                    partnerId
                  }
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_CompetitionType__c {
                  value
                }
                Impact_Management_Participation__c {
                  value
                }
              }
            }
          }
          Acc_ProjectParticipant__c(where: { Id: { eq: $partnerId } }, first: 1) {
            edges {
              node {
                Id
                Acc_ParticipantStatus__c {
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
