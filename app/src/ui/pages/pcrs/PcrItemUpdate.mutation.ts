import { graphql } from "react-relay";

export const pcrItemUpdateMutation = graphql`
  mutation PcrItemUpdateMutation($input: Acc_ProjectChangeRequest__cUpdateInput!, $projectId: String!) {
    uiapi(projectId: $projectId) {
      Acc_ProjectChangeRequest__cUpdate(input: $input) {
        success
      }
    }
  }
`;
