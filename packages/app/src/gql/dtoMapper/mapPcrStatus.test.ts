import { mapToPcrStatusDtoArray } from "./mapPcrStatus";

const edges = [
  {
    node: {
      Id: "a0F26000009akjeEAA",
      Acc_ProjectChangeRequest__c: {
        value: "a0G26000007KqPTEA0",
      },
      Acc_PreviousProjectChangeRequestStatus__c: {
        value: "Submitted to Monitoring Officer",
      },
      Acc_ExternalComment__c: {
        value: "all good",
      },
      CreatedDate: {
        value: "2023-05-24T09:46:09.000Z",
      },
      Acc_CreatedByAlias__c: {
        value: "Innovate UK",
      },
      Acc_NewProjectChangeRequestStatus__c: {
        value: "Submitted to Innovate UK",
      },
    },
  },
  {
    node: {
      Id: "a0F26000009akjZEAQ",
      Acc_ProjectChangeRequest__c: {
        value: "a0G26000007KqPTEA0",
      },
      Acc_PreviousProjectChangeRequestStatus__c: {
        value: "Draft",
      },
      Acc_ExternalComment__c: {
        value: null,
      },
      CreatedDate: {
        value: "2023-05-24T09:45:11.000Z",
      },
      Acc_CreatedByAlias__c: {
        value: "Innovate UK",
      },
      Acc_NewProjectChangeRequestStatus__c: {
        value: "Submitted to Monitoring Officer",
      },
    },
  },
  {
    node: {
      Id: "a0F26000009akjFEAQ",
      Acc_ProjectChangeRequest__c: {
        value: "a0G26000007KqPTEA0",
      },
      Acc_PreviousProjectChangeRequestStatus__c: {
        value: null,
      },
      Acc_ExternalComment__c: {
        value: null,
      },
      CreatedDate: {
        value: "2023-05-24T09:29:49.000Z",
      },
      Acc_CreatedByAlias__c: {
        value: "Innovate UK",
      },
      Acc_NewProjectChangeRequestStatus__c: {
        value: "Draft",
      },
    },
  },
];

describe("mapPcrStatusDtoArray", () => {
  it("should map the node to the projectDto structure", () => {
    expect(
      mapToPcrStatusDtoArray(
        edges,
        [
          "id",
          "pcrId",
          "createdBy",
          "createdDate",
          "newStatus",
          "previousStatus",
          "newStatusLabel",
          "comments",
          "previousStatusLabel",
        ],
        { roles: { isMo: true, isFc: false, isPm: true, isAssociate: false } },
      ),
    ).toMatchSnapshot();
  });
});
