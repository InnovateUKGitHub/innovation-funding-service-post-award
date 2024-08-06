import { graphql } from "react-relay";

export const pcrModifyOptionsCreateMutation = graphql`
  mutation PcrModifyOptionsCreateMutation($input: Acc_ProjectChangeRequest__cCreateInput!, $projectId: String!) {
    uiapi(projectId: $projectId) {
      Acc_ProjectChangeRequest__cCreate(input: $input) {
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
