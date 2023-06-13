import { graphql } from "relay-hooks";

export const projectSetupQuery = graphql`
  query ProjectSetupQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }, first: 1) {
            edges {
              node {
                Id
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectStatus__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectParticipantsProject__r(where: { Id: { eq: $partnerId } }) {
                  edges {
                    node {
                      Id
                      Acc_ParticipantStatus__c {
                        value
                      }
                      Acc_Postcode__c {
                        value
                      }
                      Acc_BankCheckCompleted__c {
                        value
                        label
                      }
                      Acc_BankCheckState__c {
                        value
                      }
                      Acc_SpendProfileCompleted__c {
                        label
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
