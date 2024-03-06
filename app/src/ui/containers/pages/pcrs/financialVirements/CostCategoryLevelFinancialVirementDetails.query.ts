import { graphql } from "relay-runtime";

const costCategoryLevelFinancialVirementDetails = graphql`
  query CostCategoryLevelFinancialVirementDetailsQuery($pcrId: ID) {
    salesforce {
      uiapi {
        query {
          Acc_ProjectChangeRequest__c(where: { Id: { eq: $pcrId } }, first: 1) {
            edges {
              node {
                Acc_Reasoning__c {
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

export { costCategoryLevelFinancialVirementDetails };
