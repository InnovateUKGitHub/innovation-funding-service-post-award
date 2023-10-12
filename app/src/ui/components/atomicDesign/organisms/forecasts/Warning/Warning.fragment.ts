import { graphql } from "react-relay";

export const warningFragment = graphql`
  fragment WarningFragment on UIAPI {
    query {
      Warning_Profile: Acc_Profile__c(
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
      Warning_CostCategory: Acc_CostCategory__c(first: 2000) {
        edges {
          node {
            Id
            Acc_CostCategoryName__c {
              value
            }
            Acc_DisplayOrder__c {
              value
            }
          }
        }
      }
      Warning_Claims: Acc_Claims__c(
        where: { and: [{ Acc_ProjectID__c: { eq: $projectIdStr } }, { Acc_ProjectParticipant__c: { eq: $partnerId } }] }
        first: 2000
      ) {
        edges {
          node {
            Id
            Acc_ProjectPeriodNumber__c {
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
            Acc_PeriodCostCategoryTotal__c {
              value
            }
          }
        }
      }
      Warning_Project: Acc_Project__c(where: { Id: { eq: $projectId } }) {
        edges {
          node {
            Id
            roles {
              isMo
              isFc
              isPm
              partnerRoles {
                isFc
                isMo
                isPm
                partnerId
              }
            }
            Acc_ProjectParticipantsProject__r(where: { Id: { eq: $partnerId } }, first: 500) {
              edges {
                node {
                  Id
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
`;
