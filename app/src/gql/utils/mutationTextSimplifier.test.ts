import { removeDirectives, mutationTextSimplifier, getMutationHash } from "./mutationTextSimplifier";

const clientMutation = `
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
  }`;

const serverMutation = `mutation PcrModifyOptionsCreateMultipleMutation(
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
    firstPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: "To Do", RecordTypeId: $recordType1}}) {
      Record {
        Id
        Name {
          value
        }
      }
    }
    secondPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: "To Do", RecordTypeId: $recordType2}}) @include(if: $hasPcr2) {
      Record {
        Id
        Name {
          value
        }
      }
    }
    thirdPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: "To Do", RecordTypeId: $recordType3}}) @include(if: $hasPcr3) {
      Record {
        Id
        Name {
          value
        }
      }
    }
    fourthPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: "To Do", RecordTypeId: $recordType4}}) @include(if: $hasPcr4) {
      Record {
        Id
        Name {
          value
        }
      }
    }
    fifthPcr: Acc_ProjectChangeRequest__cCreate(input: {Acc_ProjectChangeRequest__c: {Acc_RequestHeader__c: $headerId, Acc_Project__c: $projectId, Acc_MarkedasComplete__c: "To Do", RecordTypeId: $recordType5}}) @include(if: $hasPcr5) {
      Record {
        Id
        Name {
          value
        }
      }
    }
  }
}`;
describe("removeDirectives", () => {
  it("should strip directives from the mutation for server side mutations", () => {
    expect(removeDirectives(serverMutation, true)).toMatchSnapshot();
  });

  it("should strip directives from the mutation for client side mutations", () => {
    expect(removeDirectives(clientMutation, false)).toMatchSnapshot();
  });
});

describe("mutationTextSimplifier", () => {
  it("should simplify the text for serverside", () => {
    expect(mutationTextSimplifier(serverMutation, true)).toMatchSnapshot();
  });

  it("should simplify the text for clientside", () => {
    expect(mutationTextSimplifier(clientMutation, false)).toMatchSnapshot();
  });
});

describe("getMutationHash", () => {
  it("should get the hash of the simplified mutation for server side mutations", () => {
    expect(getMutationHash(serverMutation, true)).toMatchSnapshot();
  });

  it("should get the hash of the simplified mutation for client side mutations", () => {
    expect(getMutationHash(clientMutation, false)).toMatchSnapshot();
  });
});
