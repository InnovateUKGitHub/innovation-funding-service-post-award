import { graphql } from "react-relay";

const financeSummaryQuery = graphql`
  query FinanceSummaryQuery($projectId: ID!) {
    salesforce {
      uiapi {
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
                }
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_CurrentPeriodNumber__c {
                  value
                }
                Acc_NumberofPeriods__c {
                  value
                }
                Acc_CurrentPeriodStartDate__c {
                  value
                }
                Acc_CurrentPeriodEndDate__c {
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
                      Acc_TotalParticipantCosts__c {
                        value
                      }
                      Acc_ParticipantStatus__c {
                        value
                      }
                      Acc_TotalCostsSubmitted__c {
                        value
                      }
                      Acc_Award_Rate__c {
                        value
                      }
                      Acc_RemainingParticipantGrant__c {
                        value
                      }
                      Acc_TotalPrepayment__c {
                        value
                      }
                      Acc_TotalGrantApproved__c {
                        value
                      }
                      Acc_Cap_Limit__c {
                        value
                      }
                      Acc_CapLimitDeferredGrant__c {
                        value
                      }
                      Acc_AuditReportFrequency__c {
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

export { financeSummaryQuery };
