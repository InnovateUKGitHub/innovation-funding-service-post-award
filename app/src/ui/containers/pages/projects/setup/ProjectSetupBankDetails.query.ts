import { graphql } from "react-relay";

export const projectSetupBankDetailsQuery = graphql`
  query ProjectSetupBankDetailsQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        query {
          Acc_Project__c(where: { Id: { eq: $projectId } }) {
            edges {
              node {
                Id
                Acc_ProjectNumber__c {
                  value
                }
                Acc_ProjectTitle__c {
                  value
                }
                Acc_ProjectParticipantsProject__r(where: { Id: { eq: $partnerId } }) {
                  edges {
                    node {
                      Id
                      Acc_AccountId__r {
                        Name {
                          value
                        }
                      }
                      Acc_ProjectId__c {
                        value
                      }
                      Acc_ParticipantStatus__c {
                        value
                      }
                      Acc_BankCheckState__c {
                        value
                        label
                      }
                      Acc_BankCheckCompleted__c {
                        value
                        label
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
