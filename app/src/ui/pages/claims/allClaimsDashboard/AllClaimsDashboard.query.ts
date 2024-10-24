import { graphql } from "react-relay";
export const allClaimsDashboardQuery = graphql`
  query AllClaimsDashboardQuery($projectId: ID!, $projectIdStr: String) {
    salesforce {
      uiapi {
        ...ProjectSuspensionMessageFragment
        ...PageFragment
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
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                isActive
                roles {
                  isMo
                  isFc
                  isPm
                  isAssociate
                  partnerRoles {
                    isMo
                    isFc
                    isPm
                    isAssociate
                    partnerId
                  }
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_CurrentPeriodEndDate__c {
                  value
                }
                Acc_CurrentPeriodStartDate__c {
                  value
                }
                Acc_ProjectParticipantsProject__r(
                  orderBy: { Acc_AccountId__r: { Name: { order: ASC } } }
                  first: 1000
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
