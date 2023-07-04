import { graphql } from "react-relay";
export const editClaimLineItemsQuery = graphql`
  query EditClaimLineItemsQuery(
    $projectId: ID!
    $projectIdStr: String
    $partnerId: ID!
    $periodId: Double!
    $costCategoryId: ID!
  ) {
    currentUser {
      email
      isSystemUser
    }
    salesforce {
      uiapi {
        query {
          Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
                { RecordType: { Name: { eq: "Profile Detail" } } }
                { Acc_CostCategory__c: { eq: $costCategoryId } }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_CostCategory__c {
                  value
                }
                Acc_CostCategoryGOLCost__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_ProjectPeriodStartDate__c {
                  value
                }
                Acc_ProjectPeriodEndDate__c {
                  value
                }
                Acc_LatestForecastCost__c {
                  value
                }
                RecordType {
                  Name {
                    value
                  }
                }
              }
            }
          }
          Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
                { Acc_CostCategory__c: { eq: $costCategoryId } }
                {
                  or: [
                    { RecordType: { Name: { eq: "Claims Detail" } } }
                    { RecordType: { Name: { eq: "Claims Line Item" } } }
                  ]
                }
                { Acc_ClaimStatus__c: { ne: "New" } }
                { Acc_ClaimStatus__c: { ne: "Not used" } }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                Id
                RecordType {
                  Name {
                    value
                  }
                }
                Acc_LineItemDescription__c {
                  value
                }
                Acc_LineItemCost__c {
                  value
                }
                Acc_ProjectParticipant__c {
                  value
                }
                Acc_ReasonForDifference__c {
                  value
                }
                Owner {
                  ... on User {
                    Email {
                      value
                    }
                  }
                }
                LastModifiedDate {
                  value
                }

                Acc_ClaimStatus__c {
                  value
                  label
                }
                Acc_CostCategory__c {
                  value
                }
                ContentDocumentLinks(first: 2000) {
                  edges {
                    node {
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
                        Description {
                          value
                        }
                        CreatedBy {
                          Name {
                            value
                          }
                          Username {
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
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                Acc_NonFEC__c {
                  value
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
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
