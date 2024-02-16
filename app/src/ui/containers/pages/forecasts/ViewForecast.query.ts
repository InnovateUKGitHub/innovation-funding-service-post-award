import { graphql } from "react-relay";

export const viewForecastQuery = graphql`
  query ViewForecastQuery($projectIdStr: String!, $projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...ForecastWarningFragment
        ...TitleFragment
        query {
          Acc_Claims__c(
            where: {
              and: [
                { Acc_ProjectID__c: { eq: $projectIdStr } }
                { Acc_ProjectParticipant__c: { eq: $partnerId } }
                { RecordType: { DeveloperName: { eq: "Total_Project_Period" } } }
              ]
            }
            first: 2000
          ) {
            edges {
              node {
                Id
                Acc_ClaimStatus__c {
                  value
                }
                Acc_ProjectPeriodNumber__c {
                  value
                }
                Acc_FinalClaim__c {
                  value
                }
                Acc_PaidDate__c {
                  value
                }
                Acc_ClaimStatus__c {
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
                    isFc
                    isMo
                    isPm
                    isAssociate
                    partnerId
                  }
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_CurrentPeriodNumber__c {
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
                      Acc_NewForecastNeeded__c {
                        value
                      }
                      Acc_OverheadRate__c {
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
