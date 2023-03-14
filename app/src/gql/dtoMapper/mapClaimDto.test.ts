import { mapToClaimDtoArray } from "./mapClaimDto";

describe("mapToClaimDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "id-0",
        Acc_FinalClaim__c: {
          value: true,
        },
        Acc_PaidDate__c: {
          value: "2020-01-21",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 2,
        },
        Acc_ClaimStatus__c: {
          value: "Paid",
        },
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
      },
    },
    {
      node: {
        Id: "id-1",
        Acc_FinalClaim__c: {
          value: false,
        },
        Acc_PaidDate__c: {
          value: null,
        },
        Acc_ProjectPeriodNumber__c: {
          value: 3,
        },
        Acc_ClaimStatus__c: {
          value: "Payment Requested",
        },
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
      },
    },
    {
      node: {
        Id: "id-2",
        Acc_FinalClaim__c: {
          value: false,
        },
        Acc_PaidDate__c: {
          value: null,
        },
        Acc_ProjectPeriodNumber__c: {
          value: 3,
        },
        Acc_ClaimStatus__c: {
          value: "Approved",
        },
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
      },
    },
    {
      node: {
        Id: "id-3-defaults",
        Acc_PaidDate__c: null,
        Acc_FinalClaim__c: null,
        Acc_ProjectPeriodNumber__c: null,
        Acc_ClaimStatus__c: null,
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
      },
    },
    {
      node: {
        Id: "id-4",
        Acc_PaidDate__c: {
          value: null,
        },
        Acc_FinalClaim__c: null,
        Acc_ProjectPeriodNumber__c: null,
        Acc_ClaimStatus__c: {
          value: "Not used",
        },
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
      },
    },
    {
      node: {
        Id: "id-5",
        Acc_PaidDate__c: {
          value: null,
        },
        Acc_FinalClaim__c: {
          value: false,
        },
        Acc_ClaimStatus__c: {
          value: "New",
        },
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
      },
    },
    {
      node: {
        Id: "id-6",
        Acc_PaidDate__c: {
          value: null,
        },
        Acc_FinalClaim__c: {
          value: false,
        },
        Acc_ProjectPeriodNumber__c: {
          value: 3,
        },
        Acc_ClaimStatus__c: {
          value: "Approved",
        },
        RecordType: {
          Name: {
            value: "Random",
          },
        },
      },
    },
  ];

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(mapToClaimDtoArray(edges, ["id", "isApproved", "periodId", "isFinalClaim", "paidDate"])).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToClaimDtoArray(edges, ["id", "paidDate"])).toMatchSnapshot();
  });
});
