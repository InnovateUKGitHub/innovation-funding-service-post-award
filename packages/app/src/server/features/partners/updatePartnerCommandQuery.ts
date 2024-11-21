import gql from "graphql-tag";

export const updatePartnerSavedPartnerDataQuery = gql`
  query UpdatePartnerSavedPartnerDataQuery($projectId: ID!, $partnerId: ID!) {
    uiapi {
      query {
        Acc_Project__c(where: { Id: { eq: $projectId } }) {
          edges {
            node {
              Acc_ProjectStatus__c {
                value
              }
            }
          }
        }
        Acc_ProjectParticipant__c(
          where: { and: [{ Id: { eq: $partnerId } }, { Acc_ProjectId__c: { eq: $projectId } }] }
        ) {
          edges {
            node {
              Acc_AccountId__c {
                value
              }
              Acc_AccountId__r {
                Name {
                  value
                }
              }
              Acc_ParticipantStatus__c {
                value
              }
              Acc_BankCheckState__c {
                value
              }
              Acc_NewForecastNeeded__c {
                value
              }
              Acc_BankCheckCompleted__c {
                value
              }
              Acc_RegistrationNumber__c {
                value
              }
              Acc_AddressPostcode__c {
                value
              }
              Acc_AddressStreet__c {
                value
              }
              Acc_AddressBuildingName__c {
                value
              }
              Acc_AddressLocality__c {
                value
              }
              Acc_AddressTown__c {
                value
              }
              Acc_AccountNumber__c {
                value
              }
              Acc_SortCode__c {
                value
              }
              Acc_SpendProfileCompleted__c {
                value
              }
              Acc_Postcode__c {
                value
              }
            }
          }
        }
      }
    }
  }
`;

export interface UpdatePartnerSavedPartnerData {
  uiapi: {
    query: {
      Acc_Project__c: {
        edges: [
          {
            node: {
              Acc_ProjectStatus__c: {
                value: string;
              };
            };
          },
        ];
      };
      Acc_ProjectParticipant__c: {
        edges: [
          {
            node: {
              Acc_ParticipantStatus__c: {
                value: string;
              };
              Acc_BankCheckState__c: {
                value: string;
              };
              Acc_NewForecastNeeded__c: {
                value: boolean;
              };
              Acc_BankCheckCompleted__c: {
                value: string;
              };
              Acc_SpendProfileCompleted__c: {
                value: string;
              };
              Acc_RegistrationNumber__c: {
                value: string;
              };
              Acc_AddressPostcode__c: {
                value: string;
              };
              Acc_AddressStreet__c: {
                value: string;
              };
              Acc_AddressBuildingName__c: {
                value: string;
              };
              Acc_AddressLocality__c: {
                value: string;
              };
              Acc_AddressTown__c: {
                value: string;
              };
              Acc_AccountNumber__c: {
                value: string;
              };
              Acc_SortCode__c: {
                value: string;
              };
              Acc_AccountId__c: {
                value: string;
              };
              Acc_AccountId__r: {
                Name: {
                  value: string;
                };
              };
              Acc_Postcode__c: {
                value: string;
              };
            };
          },
        ];
      };
    };
  };
}
