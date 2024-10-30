import { mapToContactDtoArray } from "./mapContactDto";

describe("mapToContactDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "id-0",
        Acc_Role__c: {
          value: "Active",
          label: "Active label",
        },
        Acc_UserId__r: {
          Name: { value: "Ramsey Bolton" },
        },
        Acc_EmailOfSFContact__c: {
          value: "ramsey.bolton@email.com",
        },
        Acc_AccountId__c: {
          value: "1233",
        },
        Acc_ProjectId__c: {
          value: "abcd",
        },
      },
    },
    {
      node: {
        Id: "id-1",
        Acc_Role__c: {
          value: "Active",
          label: "Active label",
        },
        Acc_UserId__r: {
          Name: { value: "John Snow" },
        },
        Acc_EmailOfSFContact__c: {
          value: "john.snow@email.com",
        },
        Acc_AccountId__c: {
          value: "1233",
        },
        Acc_ProjectId__c: {
          value: "abcd",
        },
      },
    },
    {
      node: {
        Id: "id-2",
        Acc_Role__c: {
          value: "Active",
          label: "Active label",
        },
        Acc_UserId__r: {
          Name: { value: "Tywin Lannister" },
        },
        Acc_EmailOfSFContact__c: {
          value: "tywin.lannister@email.com",
        },
        Acc_AccountId__c: {
          value: "1233",
        },
        Acc_ProjectId__c: {
          value: "abcd",
        },
      },
    },

    {
      node: {
        Id: "id-3-defaults",
        Acc_Role__c: null,
        Acc_UserId__r: null,
        Acc_EmailOfSFContact__c: null,
        Acc_AccountId__c: null,
        Acc_ProjectId__c: null,
      },
    },
  ];

  it("should map the gql data to the correct Dtos", () => {
    expect(
      mapToContactDtoArray(edges, ["id", "accountId", "email", "name", "projectId", "role", "roleName"]),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToContactDtoArray(edges, ["id", "email", "name"])).toMatchSnapshot();
  });
});
