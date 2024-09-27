import { graphql } from "react-relay";
export const projectSetupBankDetailsVerifyQuery = graphql`
  query ProjectSetupBankDetailsVerifyQuery($projectId: ID!, $partnerId: ID!) {
    salesforce {
      uiapi {
        ...PageFragment
        query {
          Acc_ProjectParticipant__c(where: { Id: { eq: $partnerId } }) {
            edges {
              node {
                Id
                Acc_ProjectId__c {
                  value
                }
                Acc_AccountId__r {
                  Name {
                    value
                  }
                }
                Acc_AccountNumber__c {
                  value
                }
                Acc_AddressBuildingName__c {
                  value
                }
                Acc_AddressLocality__c {
                  value
                }
                Acc_AddressPostcode__c {
                  value
                }
                Acc_AddressStreet__c {
                  value
                }
                Acc_AddressTown__c {
                  value
                }
                Acc_RegistrationNumber__c {
                  value
                }
                Acc_FirstName__c {
                  value
                }
                Acc_LastName__c {
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
`;
