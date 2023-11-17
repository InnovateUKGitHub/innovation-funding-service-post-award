import { graphql } from "react-relay";
export const claimDashboardQuery = graphql`
  query ClaimDashboardQuery($projectId: ID!, $projectIdStr: String, $partnerId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Profile__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                Acc_PeriodLatestForecastCost__c {
                  value
                }
                Acc_ProjectParticipant__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
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
                { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
                { Acc_ClaimStatus__c: { ne: "New" } }
                { Acc_ClaimStatus__c: { ne: "Not used" } }
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
                Acc_FinalClaim__c {
                  value
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
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_CurrentPeriodEndDate__c {
                  value
                }
                Acc_ProjectParticipantsProject__r(
                  where: { Id: { eq: $partnerId } }
                  orderBy: { Acc_AccountId__r: { Name: { order: ASC } } }
                  first: 1
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
