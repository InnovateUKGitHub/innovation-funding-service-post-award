import { graphql } from "react-relay";

export const addPartnerWorkflowQuery = graphql`
  query AddPartnerWorkflowQuery($projectId: ID!, $pcrItemId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_ProjectParticipant__c(
            where: { Acc_ProjectId__c: { eq: $projectId } }
            orderBy: { Acc_AccountId__r: { Name: { order: ASC } } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                Acc_OrganisationType__c {
                  value
                }
                Acc_ParticipantStatus__c {
                  value
                }
                Acc_ProjectRole__c {
                  value
                }
              }
            }
          }
          Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrItemId } }, first: 1) {
            edges {
              node {
                Id
                Acc_ParticipantSize__c {
                  value
                }
                Acc_ProjectRole__c {
                  value
                }
                Acc_ParticipantType__c {
                  value
                }
                Acc_OrganisationName__c {
                  value
                }
                Acc_CommercialWork__c {
                  value
                }
                Acc_Location__c {
                  value
                }
                Acc_ProjectPostcode__c {
                  value
                }
                Acc_ProjectCity__c {
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
                ContentDocumentLinks(first: 2000, orderBy: { ContentDocument: { CreatedDate: { order: DESC } } }) {
                  edges {
                    node {
                      Id
                      LinkedEntityId {
                        value
                      }
                      isFeedAttachment
                      isOwner
                      ContentDocument {
                        Id
                        LastModifiedBy {
                          ContactId {
                            value
                          }
                        }
                        Description {
                          value
                        }
                        CreatedDate {
                          value
                        }
                        LatestPublishedVersionId {
                          value
                        }
                        FileExtension {
                          value
                        }
                        Title {
                          value
                        }
                        ContentSize {
                          value
                        }
                        CreatedBy {
                          Name {
                            value
                          }
                          Id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                roles {
                  isPm
                  isFc
                  isMo
                }
                Acc_CompetitionType__c {
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
