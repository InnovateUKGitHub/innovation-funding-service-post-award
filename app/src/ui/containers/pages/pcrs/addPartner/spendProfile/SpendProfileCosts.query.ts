import { graphql } from "react-relay";

export const spendProfileCostsQuery = graphql`
  query SpendProfileCostsQuery($projectId: ID!, $pcrItemId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_CostCategory__c(first: 2000, orderBy: { Acc_DisplayOrder__c: { order: ASC } }) {
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
          Acc_IFSSpendProfile__c(
            where: {
              and: [
                { RecordType: { DeveloperName: { eq: "PCR_Spend_Profile" } } }
                { Acc_ProjectChangeRequest__c: { eq: $pcrItemId } }
              ]
            }
            orderBy: { CreatedDate: { order: ASC } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_CostCategoryID__c {
                  value
                }
                Acc_ProjectChangeRequest__c {
                  value
                }
                Acc_TotalCost__c {
                  value
                }
                Acc_ItemDescription__c {
                  value
                }
                Acc_DateSecured__c {
                  value
                }
                Acc_GrossCostOfRole__c {
                  value
                }
                Acc_DaysSpentOnProject__c {
                  value
                }
                Acc_Rate__c {
                  value
                }
                Acc_OverheadRate__c {
                  value
                }
                Acc_Quantity__c {
                  value
                }
                Acc_CostPerItem__c {
                  value
                }
                Acc_Country__c {
                  value
                }
                Acc_RoleAndDescription__c {
                  value
                }
                Acc_NewOrExisting__c {
                  value
                }
                Acc_DepreciationPeriod__c {
                  value
                }
                Acc_NetPresentValue__c {
                  value
                }
                Acc_ResidualValue__c {
                  value
                }
                Acc_Utilisation__c {
                  value
                }
                Acc_NumberOfTimes__c {
                  value
                }
                Acc_CostEach__c {
                  value
                }
                RecordType {
                  Name {
                    value
                  }
                  DeveloperName {
                    value
                  }
                }
              }
            }
          }
          Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrItemId } }, first: 1) {
            edges {
              node {
                Id
                Acc_CommercialWork__c {
                  value
                }
                Acc_MarkedasComplete__c {
                  value
                }
                Acc_OrganisationName__c {
                  value
                }
                Acc_OtherFunding__c {
                  value
                }
                Acc_ParticipantType__c {
                  value
                }
                Acc_ProjectRole__c {
                  value
                }
                Acc_Status__c {
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
                  isAssociate
                }
                Acc_CompetitionType__c {
                  value
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
                Acc_CompetitionId__r {
                  Acc_TypeofAid__c {
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
