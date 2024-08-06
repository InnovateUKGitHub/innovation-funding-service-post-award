import { graphql } from "react-relay";

export const pcrDeleteMutation = graphql`
  mutation PcrDeleteMutation($pcrId: IdOrRef!, $projectId: String!) {
    uiapi(projectId: $projectId) {
      Acc_ProjectChangeRequest__cDelete(input: { Id: $pcrId }) {
        Id
      }
    }
  }
`;
