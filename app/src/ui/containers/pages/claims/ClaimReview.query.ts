import { graphql } from "react-relay";
export const claimReviewQuery = graphql`
  query ClaimReviewQuery($projectId: ID!, $projectIdStr: String, $partnerId: ID!, $periodId: Double!) {
    currentUser {
      userId
    }
    salesforce {
      uiapi {
        ...StatusChangesLogsFragment
        ...ForecastTableFragment
        ...TitleFragment
        ...ClaimTableFragment
        ...ClaimPeriodDateFragment
        query {
          AllClaimsForPartner: Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
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
                Acc_FinalClaim__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_ProjectParticipant__c {
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
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                roles {
                  isMo
                  isFc
                  isPm
                }
                Acc_CompetitionId__r {
                  Name {
                    value
                  }
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Impact_Management_Participation__c {
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
