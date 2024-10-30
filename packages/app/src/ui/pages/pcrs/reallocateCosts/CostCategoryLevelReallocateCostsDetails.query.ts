import { graphql } from "relay-runtime";

const costCategoryLevelReallocateCostsDetails = graphql`
  query CostCategoryLevelReallocateCostsDetailsQuery($pcrId: ID) {
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

export { costCategoryLevelReallocateCostsDetails };
