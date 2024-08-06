import { graphql } from "react-relay";

export const spendProfileUpdateItemMutation = graphql`
  mutation SpendProfileUpdateItemMutation($input: Acc_IFSSpendProfile__cUpdateInput!, $projectId: String!) {
    uiapi(projectId: $projectId) {
      Acc_IFSSpendProfile__cUpdate(input: $input) {
        success
      }
    }
  }
`;
