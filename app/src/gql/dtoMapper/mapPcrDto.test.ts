import { mapToPcrDtoArray, PcrNode } from "./mapPcrDto";

const edges = [
  {
    node: {
      Id: "a0G26000007K4vtEAC",
      Acc_Status__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007K4veEAC",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      CreatedDate: {
        value: "2023-04-13T09:36:55.000Z",
      },
      LastModifiedDate: {
        value: "2023-04-13T09:38:24.000Z",
      },
      Acc_Project__c: {
        value: "a0E2600000o75OAEAY",
      },
      RecordType: {
        Name: {
          value: "Change project scope",
          label: "Change project scope",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KUl6EAG",
      Acc_Status__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KUl3EAG",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      CreatedDate: {
        value: "2023-04-19T10:17:21.000Z",
      },
      LastModifiedDate: {
        value: "2023-04-19T10:17:21.000Z",
      },
      Acc_Project__c: {
        value: "a0E2600000o75OAEAY",
      },
      RecordType: {
        Name: {
          value: "Change a partner's name",
          label: "Change a partner's name",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KUl5EAG",
      Acc_Status__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KUl3EAG",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      CreatedDate: {
        value: "2023-04-19T10:17:21.000Z",
      },
      LastModifiedDate: {
        value: "2023-04-19T10:17:21.000Z",
      },
      Acc_Project__c: {
        value: "a0E2600000o75OAEAY",
      },
      RecordType: {
        Name: {
          value: "Add a partner",
          label: "Add a partner",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KUl4EAG",
      Acc_Status__c: {
        value: null,
      },
      Acc_RequestHeader__c: {
        value: "a0G26000007KUl3EAG",
      },
      Acc_RequestNumber__c: {
        value: null,
      },
      CreatedDate: {
        value: "2023-04-19T10:17:21.000Z",
      },
      LastModifiedDate: {
        value: "2023-04-19T10:17:21.000Z",
      },
      Acc_Project__c: {
        value: "a0E2600000o75OAEAY",
      },
      RecordType: {
        Name: {
          value: "Reallocate several partners' project cost",
          label: "Reallocate several partners' project cost",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007KUl3EAG",
      Acc_Status__c: {
        value: "Draft",
      },
      Acc_RequestHeader__c: {
        value: null,
      },
      Acc_RequestNumber__c: {
        value: 3,
      },
      CreatedDate: {
        value: "2023-04-19T10:17:19.000Z",
      },
      LastModifiedDate: {
        value: "2023-04-19T10:17:24.000Z",
      },
      Acc_Project__c: {
        value: "a0E2600000o75OAEAY",
      },
      RecordType: {
        Name: {
          value: "Request Header",
          label: "Request Header",
        },
      },
    },
  },
  {
    node: {
      Id: "a0G26000007K4veEAC",
      Acc_Status__c: {
        value: "Submitted to Monitoring Officer",
      },
      Acc_RequestHeader__c: {
        value: null,
      },
      Acc_RequestNumber__c: {
        value: 2,
      },
      CreatedDate: {
        value: "2023-04-13T09:36:53.000Z",
      },
      LastModifiedDate: {
        value: "2023-04-13T09:39:06.000Z",
      },
      Acc_Project__c: {
        value: "a0E2600000o75OAEAY",
      },
      RecordType: {
        Name: {
          value: "Request Header",
          label: "Request Header",
        },
      },
    },
  },
] as ReadonlyArray<Readonly<{ node: PcrNode } | null> | null>;

describe("mapPcrDtoArray", () => {
  it("should map the node to the projectDto structure", () => {
    expect(
      mapToPcrDtoArray(
        edges,
        ["status", "statusName", "started", "lastUpdated", "id", "projectId", "requestNumber"],
        ["shortName"],
      ),
    ).toMatchSnapshot();
  });
});
