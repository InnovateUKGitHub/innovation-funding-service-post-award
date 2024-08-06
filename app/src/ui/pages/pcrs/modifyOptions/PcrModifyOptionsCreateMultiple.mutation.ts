import { graphql } from "react-relay";

export const pcrModifyOptionsCreateMultipleMutation = graphql`
  mutation PcrModifyOptionsCreateMultipleMutation(
    $headerId: IdOrRef!
    $projectId: IdOrRef!
    $hasPcr2: Boolean!
    $hasPcr3: Boolean!
    $hasPcr4: Boolean!
    $hasPcr5: Boolean!
    $recordType1: IdOrRef!
    $recordType2: IdOrRef
    $recordType3: IdOrRef
    $recordType4: IdOrRef
    $recordType5: IdOrRef
    $projectIdStr: String!
  ) {
    uiapi(projectId: $projectIdStr) {
      firstPcr: Acc_ProjectChangeRequest__cCreate(
        input: {
          Acc_ProjectChangeRequest__c: {
            Acc_RequestHeader__c: $headerId
            Acc_Project__c: $projectId
            Acc_MarkedasComplete__c: "To Do"
            RecordTypeId: $recordType1
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

      ... @include(if: $hasPcr2) {
        secondPcr: Acc_ProjectChangeRequest__cCreate(
          input: {
            Acc_ProjectChangeRequest__c: {
              Acc_RequestHeader__c: $headerId
              Acc_Project__c: $projectId
              Acc_MarkedasComplete__c: "To Do"
              RecordTypeId: $recordType2
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
      ... @include(if: $hasPcr3) {
        thirdPcr: Acc_ProjectChangeRequest__cCreate(
          input: {
            Acc_ProjectChangeRequest__c: {
              Acc_RequestHeader__c: $headerId
              Acc_Project__c: $projectId
              Acc_MarkedasComplete__c: "To Do"
              RecordTypeId: $recordType3
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
      ... @include(if: $hasPcr4) {
        fourthPcr: Acc_ProjectChangeRequest__cCreate(
          input: {
            Acc_ProjectChangeRequest__c: {
              Acc_RequestHeader__c: $headerId
              Acc_Project__c: $projectId
              Acc_MarkedasComplete__c: "To Do"
              RecordTypeId: $recordType4
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
      ... @include(if: $hasPcr5) {
        fifthPcr: Acc_ProjectChangeRequest__cCreate(
          input: {
            Acc_ProjectChangeRequest__c: {
              Acc_RequestHeader__c: $headerId
              Acc_Project__c: $projectId
              Acc_MarkedasComplete__c: "To Do"
              RecordTypeId: $recordType5
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
  }
`;
