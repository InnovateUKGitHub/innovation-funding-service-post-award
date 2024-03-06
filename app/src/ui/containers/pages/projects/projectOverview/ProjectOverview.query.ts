import { graphql } from "react-relay";

export const projectOverviewQuery = graphql`
  query ProjectOverviewQuery($projectId: ID!) {
    currentUser {
      email
    }
    salesforce {
      uiapi {
        ...ProjectSuspensionMessageFragment
        query {
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
                  isSalesforceSystemUser
                  partnerRoles {
                    isFc
                    isMo
                    isPm
                    isAssociate
                    partnerId
                  }
                }
                claimCounts {
                  SUBMITTED
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
                Acc_CurrentPeriodNumber__c {
                  value
                }
                Acc_NumberofPeriods__c {
                  value
                }
                Acc_EndDate__c {
                  value
                }
                Acc_CurrentPeriodStartDate__c {
                  value
                }
                Acc_CurrentPeriodEndDate__c {
                  value
                }
                Acc_GOLTotalCostAwarded__c {
                  value
                }
                Acc_TotalProjectCosts__c {
                  value
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_PCRsUnderQuery__c {
                  value
                }
                Acc_PCRsForReview__c {
                  value
                }
                Acc_ClaimsForReview__c {
                  value
                }
                Acc_ProjectParticipantsProject__r(orderBy: { Acc_AccountId__r: { Name: { order: ASC } } }, first: 500) {
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
                      Acc_ParticipantStatus__c {
                        value
                      }
                      Acc_AccountId__c {
                        value
                      }
                      Acc_TotalParticipantCosts__c {
                        value
                      }
                      Acc_TotalApprovedCosts__c {
                        value
                      }
                      Acc_NewForecastNeeded__c {
                        value
                      }
                      Acc_TrackingClaims__c {
                        value
                      }
                      Acc_ParticipantStatus__c {
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
