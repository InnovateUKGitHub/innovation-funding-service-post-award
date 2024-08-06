import { graphql } from "react-relay";

export const pcrModifyOptionsCreateHeaderMutation = graphql`
  mutation PcrModifyOptionsCreateHeaderMutation($projectId: IdOrRef!, $projectIdStr: String!) {
    uiapi(projectId: $projectIdStr) {
      Acc_ProjectChangeRequest__cCreate(
        input: {
          Acc_ProjectChangeRequest__c: {
            RecordTypeId: "0124I000000FZHaQAO"
            Acc_MarkedasComplete__c: "To Do"
            Acc_Status__c: "Draft"
            Acc_Project__c: $projectId
          }
        }
      ) {
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
