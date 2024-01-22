import { graphql } from "react-relay";

export const claimDetailDocumentsQuery = graphql`
  query ClaimDetailDocumentsQuery(
    $projectId: ID!
    $partnerId: ID!
    $periodId: Double
    $costCategoryId: ID!
    $projectIdStr: String!
  ) {
    salesforce {
      uiapi {
        query {
          Acc_CostCategory__c(first: 2000) {
            edges {
              node {
                Id
                Acc_CostCategoryName__c {
                  value
                }
                Acc_DisplayOrder__c {
                  value
                }
                Acc_OrganisationType__c {
                  value
                }
                Acc_CompetitionType__c {
                  value
                }
              }
            }
          }
          ClaimsDocuments: Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
                { Acc_CostCategory__c: { eq: $costCategoryId } }
                { RecordType: { DeveloperName: { eq: "Claims_Detail" } } }
                { Acc_ClaimStatus__c: { ne: "New" } }
                { Acc_ClaimStatus__c: { ne: "Not used" } }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                Id
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
                  isAssociate
                  partnerRoles {
                    isFc
                    isMo
                    isPm
                    isAssociate
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
        }
      }
    }
  }
`;
