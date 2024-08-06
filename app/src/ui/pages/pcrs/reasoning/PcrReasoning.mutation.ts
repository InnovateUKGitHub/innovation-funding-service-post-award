import { graphql } from "react-relay";

export const pcrReasoningMutation = graphql`
  mutation PcrReasoningMutation($input: Acc_ProjectChangeRequest__cUpdateInput!) {
    uiapi {
      Acc_ProjectChangeRequest__cUpdate(input: $input) {
        success
      }
    }
  }
`;
