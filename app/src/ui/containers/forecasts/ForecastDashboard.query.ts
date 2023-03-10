import { graphql } from "react-relay";
export const forecastDashboardQuery = graphql`
  query ForecastDashboardQuery($projectId: ID!) {
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
                Acc_ProjectParticipantsProject__r(orderBy: { Acc_AccountId__r: { Name: { order: ASC } } }) {
                  edges {
                    node {
                      Id
                      Acc_AccountId__r {
                        Name {
                          value
                        }
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
