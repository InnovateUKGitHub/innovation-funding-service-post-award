import { graphql } from "react-relay";
export const claimLineItemsQuery = graphql`
  query ClaimLineItemsQuery(
    $projectId: ID!
    $projectIdStr: String
    $partnerId: ID!
    $periodId: Double!
    $costCategoryId: ID!
  ) {
    currentUser {
      isSystemUser
      userId
      email
    }
    salesforce {
      uiapi {
        ...PageFragment
        ...AwardRateOverridesMessageFragment
        query {
          Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
                { RecordType: { DeveloperName: { eq: "Profile_Detail" } } }
                { Acc_CostCategory__c: { eq: $costCategoryId } }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                Id
                RecordType {
                  DeveloperName {
                    value
                  }
                }
                Acc_OverrideAwardRate__c {
                  value
                }
                Acc_ProfileOverrideAwardRate__c {
                  value
                }
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
                    { RecordType: { DeveloperName: { eq: "Claims_Detail" } } }
                    { RecordType: { DeveloperName: { eq: "Claims_Line_Item" } } }
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
                  DeveloperName {
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
                OwnerId {
                  value
                }
                LastModifiedDate {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_ClaimStatus__c {
                  value
                }
                Acc_CostCategory__c {
                  value
                }
                ContentDocumentLinks(first: 2000, orderBy: { ContentDocument: { CreatedDate: { order: DESC } } }) {
                  edges {
                    node {
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
                          Id
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
                isActive
                Acc_CompetitionType__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_ProjectParticipantsProject__r(where: { Id: { eq: $partnerId } }, first: 1) {
                  edges {
                    node {
                      Id
                      Acc_OrganisationType__c {
                        value
                      }
                      Acc_OverheadRate__c {
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
