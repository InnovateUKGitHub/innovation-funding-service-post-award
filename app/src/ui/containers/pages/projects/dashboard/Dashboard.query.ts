import { graphql } from "react-relay";

export const projectDashboardQuery = graphql`
  query DashboardProjectDashboardQuery {
    salesforce {
      uiapi {
        query {
          Acc_BroadcastMessage__c(
            first: 100
            where: {
              and: [{ Acc_StartDate__c: { lte: { literal: TODAY } } }, { Acc_EndDate__c: { gte: { literal: TODAY } } }]
            }
          ) {
            edges {
              node {
                Acc_Message__c {
                  value
                }
                Competition_type__c {
                  value
                }
                Id
                DisplayValue
              }
            }
          }
          Acc_Project__c(
            first: 2000
            orderBy: {
              Acc_ClaimsForReview__c: { nulls: LAST, order: DESC }
              Acc_PCRsForReview__c: { nulls: LAST, order: DESC }
              Acc_PCRsUnderQuery__c: { nulls: LAST, order: DESC }
              Acc_ProjectTitle__c: { nulls: LAST, order: ASC }
            }
          ) {
            edges {
              node {
                Id
                roles {
                  isMo
                  isFc
                  isPm
                  isAssociate
                  isSalesforceSystemUser
                  partnerRoles {
                    isFc
                    isPm
                    isMo
                    isAssociate
                    partnerId
                  }
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
                Acc_LeadParticipantName__c {
                  value
                }
                Acc_LeadParticipantID__c {
                  value
                }
                Acc_NumberofPeriods__c {
                  value
                }
                Acc_CurrentPeriodNumber__c {
                  value
                }
                Acc_StartDate__c {
                  value
                }
                Acc_EndDate__c {
                  value
                }
                Acc_ClaimsForReview__c {
                  value
                }
                Acc_PCRsForReview__c {
                  value
                }
                Acc_PCRsUnderQuery__c {
                  value
                }
                Acc_ClaimsOverdue__c {
                  value
                }
                Acc_ClaimsUnderQuery__c {
                  value
                }
                Acc_NumberOfOpenClaims__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                  label
                }
                Acc_CurrentPeriodStartDate__c {
                  value
                }
                Acc_CurrentPeriodEndDate__c {
                  value
                }
                # start block
                Acc_ProjectParticipantsProject__r(first: 500) {
                  edges {
                    node {
                      Acc_AccountId__r {
                        Name {
                          value
                        }
                        Id
                      }
                      Acc_AccountId__c {
                        value
                      }
                      Id
                      Acc_NewForecastNeeded__c {
                        value
                      }
                      Acc_ParticipantStatus__c {
                        value
                      }
                      Acc_TrackingClaims__c {
                        value
                      }
                      Acc_OpenClaimStatus__c {
                        value
                      }
                    }
                  }
                }
                # end block
              }
            }
          }
        }
      }
    }
  }
`;
