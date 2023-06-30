import { graphql } from "react-relay";
export const claimDetailsQuery = graphql`
  query ClaimDetailsQuery($projectId: ID!, $projectIdStr: String, $partnerId: ID!) {
    currentUser {
      email
    }
    salesforce {
      uiapi {
        query {
          Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                {
                  or: [
                    { RecordType: { Name: { eq: "Profile Detail" } } }
                    { RecordType: { Name: { eq: "Total Cost Category" } } }
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
                  Name {
                    value
                  }
                }
              }
            }
          }
          Acc_StatusChange__c(
            where: { Acc_Claim__r: { Acc_ProjectParticipant__c: { eq: $partnerId } } }
            orderBy: { CreatedDate: { order: DESC } }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_NewClaimStatus__c {
                  value
                }
                Acc_ExternalComment__c {
                  value
                }
                Acc_ParticipantVisibility__c {
                  value
                }
                Acc_CreatedByAlias__c {
                  value
                }
                CreatedDate {
                  value
                }
              }
            }
          }
          Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                {
                  or: [
                    { RecordType: { Name: { eq: "Total Project Period" } } }
                    { RecordType: { Name: { eq: "Claims Detail" } } }
                  ]
                }
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
                  Name {
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
                Acc_PaidDate__c {
                  value
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
                Acc_NumberofPeriods__c {
                  value
                }
                Acc_CurrentPeriodNumber__c {
                  value
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ClaimsUnderQuery__c {
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
                Acc_ClaimFrequency__c {
                  value
                }
                Acc_GOLTotalCostAwarded__c {
                  value
                }
                Acc_ClaimsOverdue__c {
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
