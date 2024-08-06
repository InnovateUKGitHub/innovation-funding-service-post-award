import { graphql } from "react-relay";

export const spendProfileCreateItemMutation = graphql`
  mutation SpendProfileCreateItemMutation($input: Acc_IFSSpendProfile__cCreateInput!, $projectId: String!) {
    uiapi(projectId: $projectId) {
      Acc_IFSSpendProfile__cCreate(input: $input) {
        Record {
          Id
          Name {
            value
          }
        }
      }
    }
  }
`;
