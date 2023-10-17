import { graphql } from "react-relay";
export const claimDetailsQuery = graphql`
  query ClaimDetailsQuery($projectId: ID!, $projectIdStr: String, $partnerId: ID!, $periodId: Double!) {
    currentUser {
      userId
    }
    salesforce {
      uiapi {
        ...StatusChangesLogsFragment
        ...ForecastTableFragment
        ...TitleFragment
        query {
          Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                {
                  or: [
                    { RecordType: { DeveloperName: { eq: "Profile_Detail" } } }
                    { RecordType: { DeveloperName: { eq: "Total_Cost_Category" } } }
                  ]
                }
                { Acc_CostCategory__c: { ne: null } }
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
                  DeveloperName {
                    value
                  }
                }
              }
            }
          }
          ClaimsByPeriodForDocuments: Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
              ]
            }
            first: 2000
            orderBy: { Acc_ProjectParticipant__r: { Acc_AccountId__r: { Name: { order: ASC } } } }
          ) {
            edges {
              node {
                RecordType {
                  DeveloperName {
                    value
                  }
                }
                Acc_CostCategory__c {
                  value
                }
                ContentDocumentLinks(first: 2000, orderBy: { ContentDocument: { CreatedDate: { order: DESC } } }) {
                  edges {
                    node {
                      Id
                      LinkedEntityId {
                        value
                      }
                      isFeedAttachment
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
          ClaimDetails: Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { RecordType: { DeveloperName: { eq: "Claims_Detail" } } }
                { Acc_ClaimStatus__c: { ne: "New" } }
                { Acc_CostCategory__c: { ne: null } }
              ]
            }
            first: 2000
            orderBy: { Acc_ProjectParticipant__r: { Acc_AccountId__r: { Name: { order: ASC } } } }
          ) {
            edges {
              node {
                RecordType {
                  DeveloperName {
                    value
                  }
                }
                Acc_ClaimStatus__c {
                  value
                }
                Acc_CostCategory__c {
                  value
                }
                Acc_PeriodCostCategoryTotal__c {
                  value
                }
                Acc_ProjectPeriodEndDate__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_ProjectPeriodStartDate__c {
                  value
                }
              }
            }
          }
          Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
                { Acc_ClaimStatus__c: { ne: "New" } }
                { Acc_ClaimStatus__c: { ne: "Not used" } }
              ]
            }
            first: 2000
            orderBy: { Acc_ProjectParticipant__r: { Acc_AccountId__r: { Name: { order: ASC } } } }
          ) {
            edges {
              node {
                Id
                RecordType {
                  DeveloperName {
                    value
                  }
                }
                Acc_ProjectParticipant__r {
                  Acc_AccountId__r {
                    Name {
                      value
                    }
                  }
                }
                Acc_PeriodCostCategoryTotal__c {
                  value
                }
                LastModifiedDate {
                  value
                }
                Acc_ApprovedDate__c {
                  value
                }
                Acc_ClaimStatus__c {
                  value
                  label
                }
                Acc_ProjectParticipant__r {
                  Id
                }
                Acc_ProjectPeriodEndDate__c {
                  value
                }
                Acc_ProjectPeriodStartDate__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_ProjectPeriodCost__c {
                  value
                }
                Acc_TotalCostsApproved__c {
                  value
                }
                Acc_TotalCostsSubmitted__c {
                  value
                }
                Acc_TotalDeferredAmount__c {
                  value
                }
                Acc_FinalClaim__c {
                  value
                }
                Acc_CostCategory__c {
                  value
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
          Acc_ProjectParticipant__c(
            where: { and: [{ Acc_ProjectId__c: { eq: $projectId } }, { Id: { eq: $partnerId } }] }
          ) {
            edges {
              node {
                Id
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                Acc_AccountId__c {
                  value
                }
                Acc_TotalParticipantGrant__c {
                  value
                }
                Acc_ProjectRole__c {
                  value
                }
                Acc_ForecastLastModifiedDate__c {
                  value
                }
                Acc_OrganisationType__c {
                  value
                }
                Acc_ParticipantStatus__c {
                  value
                }
                Acc_TotalFutureForecastsForParticipant__c {
                  value
                }
                Acc_TotalParticipantCosts__c {
                  value
                }
                Acc_TotalCostsSubmitted__c {
                  value
                }
                Acc_Overdue_Project__c {
                  value
                }
                Acc_OverheadRate__c {
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
                roles {
                  isMo
                  isFc
                  isPm
                  partnerRoles {
                    isMo
                    isFc
                    isPm
                    partnerId
                  }
                }
                Acc_ProjectStatus__c {
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
