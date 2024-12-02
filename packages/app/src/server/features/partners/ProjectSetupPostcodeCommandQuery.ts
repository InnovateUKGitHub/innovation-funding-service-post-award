import gql from "graphql-tag";

export const projectSetupPostcodeCommandQuery = gql`
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

export interface ProjectSetupPostcodeCommandData {
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
