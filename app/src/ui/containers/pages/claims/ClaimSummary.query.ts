import { graphql } from "react-relay";

export const claimSummaryQuery = graphql`
  query ClaimSummaryQuery($projectId: ID!, $projectIdStr: String, $partnerId: ID!, $periodId: Double!) {
    currentUser {
      userId
    }
    salesforce {
      uiapi {
        ...AwardRateOverridesMessageFragment
        ...StatusChangesLogsFragment
        ...TitleFragment
        ...TotalCostsClaimedFragment
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
          ClaimForPartner: Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { Acc_ProjectPeriodNumber__c: { eq: $periodId } }
                { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
                { Acc_ClaimStatus__c: { ne: "New " } }
                { Acc_ClaimStatus__c: { ne: "Not used" } }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                RecordType {
                  DeveloperName {
                    value
                  }
                }
                Id
                Acc_ProjectParticipant__c {
                  value
                }
                Acc_ClaimStatus__c {
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
                Acc_ProjectPeriodEndDate__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_ProjectPeriodStartDate__c {
                  value
                }
                Acc_ProjectParticipant__c {
                  value
                }
                Acc_ReasonForDifference__c {
                  value
                }
                Acc_ProjectPeriodCost__c {
                  value
                }
                IM_PhasedCompetition__c {
                  value
                }
                IM_PhasedCompetitionStage__c {
                  value
                }
                Impact_Management_Participation__c {
                  value
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
            orderBy: {
              Acc_ProjectParticipant__r: { Acc_AccountId__r: { Name: { order: ASC } } }
              Acc_ProjectPeriodNumber__c: { order: ASC }
            }
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
                  Name {
                    value
                  }
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
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_Award_Rate__c {
                  value
                }
                Acc_TotalParticipantGrant__c {
                  value
                }
                Acc_TotalFutureForecastsForParticipant__c {
                  value
                }
                Acc_TotalApprovedCosts__c {
                  value
                }
                Acc_TotalParticipantCosts__c {
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

                Impact_Management_Participation__c {
                  value
                }
                Acc_NonFEC__c {
                  value
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_MonitoringLevel__c {
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
