import { graphql } from "relay-runtime";

const upliftSummaryQuery = graphql`
  query UpliftSummaryQuery($projectId: ID!, $pcrId: ID!, $pcrItemId: ID!) {
    salesforce {
      uiapi {
        query {
          Header: Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrId } }, first: 1) {
            edges {
              node {
                Acc_RequestNumber__c {
                  value
                }
              }
            }
          }
          Child: Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrItemId } }, first: 1) {
            edges {
              node {
                Override_Justification__c {
                  value
                }
              }
            }
          }
          Documents: ContentDocumentLink(
            where: { LinkedEntityId: { in: [$pcrId, $pcrItemId] } }
            first: 2000
            orderBy: { ContentDocument: { CreatedDate: { order: DESC } } }
          ) {
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
          Acc_VirementsForParticipant: Acc_Virements__c(
            where: {
              Acc_ProjectChangeRequest__c: { eq: $pcrItemId }
              RecordType: { DeveloperName: { eq: "Acc_VirementsForParticipant" } }
            }
            first: 200
          ) {
            edges {
              node {
                Id
                Acc_ProjectParticipant__c {
                  value
                }
                Acc_ProjectChangeRequest__c {
                  value
                }
                Acc_NewAwardRate__c {
                  value
                }
                Acc_CurrentAwardRate__c {
                  value
                }
                Acc_NewTotalEligibleCosts__c {
                  value
                }
                Acc_NewRemainingGrant__c {
                  value
                }
              }
            }
          }
          Acc_VirementsForCosts: Acc_Virements__c(
            where: {
              Acc_ParticipantVirement__r: { Acc_ProjectChangeRequest__c: { eq: $pcrItemId } }
              RecordType: { DeveloperName: { eq: "Acc_VirementsForCosts" } }
            }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_Profile__r {
                  Id
                  Acc_CostCategory__c {
                    value
                  }
                }
                Acc_ParticipantVirement__c {
                  value
                }
                Acc_CurrentCosts__c {
                  value
                }
                Acc_ClaimedCostsToDate__c {
                  value
                }
                Acc_NewCosts__c {
                  value
                }
              }
            }
          }

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
                Acc_ProjectRole__c {
                  value
                }
              }
            }
          }

          Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectParticipant__r: { Acc_ProjectId__c: { eq: $projectId } } }
                {
                  or: [
                    { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
                    { RecordType: { DeveloperName: { eq: "Total_Cost_Category" } } }
                  ]
                }
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
                Acc_CostCategory__r {
                  Acc_CostCategoryName__c {
                    value
                  }
                }
                Acc_ProjectParticipant__c {
                  value
                }
                Acc_CostCategoryGOLCost__c {
                  value
                }
                Acc_OverrideAwardRate__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_ProfileOverrideAwardRate__c {
                  value
                }
                Acc_CostCategoryAwardOverride__c {
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
        }
      }
    }
  }
`;

export { upliftSummaryQuery };
