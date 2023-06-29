import { graphql } from "react-relay";

export const updateForecastQuery = graphql`
  query UpdateForecastQuery($projectIdStr: String!, $projectId: ID!, $partnerId: ID!) {
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
            first: 1000
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
          Acc_Claims__c(
            where: {
              and: [{ Acc_ProjectID__c: { eq: $projectIdStr } }, { Acc_ProjectParticipant__c: { eq: $partnerId } }]
            }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_ClaimStatus__c {
                  value
                }
                Acc_ProjectID__c {
                  value
                }
                Acc_ProjectParticipant__r {
                  Id
                  Acc_OverheadRate__c {
                    value
                  }
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
                Acc_FinalClaim__c {
                  value
                }
                Acc_PaidDate__c {
                  value
                }
                Acc_CostCategory__c {
                  value
                }
                RecordType {
                  Name {
                    value
                  }
                }
                Acc_IAR_Status__c {
                  value
                }
                Acc_IARRequired__c {
                  value
                }
                Acc_PeriodCostCategoryTotal__c {
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
                  isSalesforceSystemUser
                  partnerRoles {
                    isFc
                    isMo
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
                Acc_CurrentPeriodNumber__c {
                  value
                }
                Acc_NumberofPeriods__c {
                  value
                }
                Acc_CompetitionType__c {
                  value
                }
                Acc_ProjectParticipantsProject__r(where: { Id: { eq: $partnerId } }, first: 500) {
                  edges {
                    node {
                      Id
                      Acc_AccountId__r {
                        Name {
                          value
                        }
                      }
                      Acc_ParticipantStatus__c {
                        value
                      }
                      Acc_ProjectRole__c {
                        value
                      }
                      Acc_OverheadRate__c {
                        value
                      }
                      Acc_OrganisationType__c {
                        value
                      }
                      Acc_ForecastLastModifiedDate__c {
                        value
                      }
                      Acc_AccountId__c {
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
