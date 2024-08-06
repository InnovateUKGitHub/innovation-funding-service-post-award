import { graphql } from "react-relay";

export const spendProfileDeleteItemMutation = graphql`
  mutation SpendProfileDeleteItemMutation($id: IdOrRef!, $projectId: String!) {
    uiapi(projectId: $projectId) {
      Acc_IFSSpendProfile__cDelete(input: { Id: $id }) {
        Id
      }
    }
  }
`;
