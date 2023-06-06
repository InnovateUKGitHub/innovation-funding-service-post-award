import { mapToClaimDtoArray } from "./mapClaimDto";

describe("mapToClaimDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "a0526000009Mc2aAAC",
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
        LastModifiedDate: {
          value: "2023-05-24T14:53:35.000Z",
        },
        Acc_ApprovedDate__c: {
          value: null,
        },
        Acc_ClaimStatus__c: {
          value: "Innovate Queried",
          label: "Queried by Innovate UK",
        },
        Acc_PaidDate__c: {
          value: null,
        },
        Acc_ProjectParticipant__r: {
          Id: "a0D2600000zXl72EAC",
        },
        Acc_ProjectPeriodEndDate__c: {
          value: "2024-04-30",
        },
        Acc_ProjectPeriodStartDate__c: {
          value: "2024-04-01",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 12,
        },
        Acc_ProjectPeriodCost__c: {
          value: 498000,
        },
      },
    },
    {
      node: {
        Id: "a0526000009Mc1OAAS",
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
        LastModifiedDate: {
          value: "2023-05-17T15:38:39.000Z",
        },
        Acc_ApprovedDate__c: {
          value: "2023-05-17",
        },
        Acc_ClaimStatus__c: {
          value: "Approved",
          label: "Payment being processed",
        },
        Acc_PaidDate__c: {
          value: null,
        },
        Acc_ProjectParticipant__r: {
          Id: "a0D2600000zXl71EAC",
        },
        Acc_ProjectPeriodEndDate__c: {
          value: "2023-05-31",
        },
        Acc_ProjectPeriodStartDate__c: {
          value: "2023-05-01",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 1,
        },
        Acc_ProjectPeriodCost__c: {
          value: null,
        },
      },
    },
    {
      node: {
        Id: "a0526000009Mc2RAAS",
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
        LastModifiedDate: {
          value: "2023-05-16T15:24:19.000Z",
        },
        Acc_ApprovedDate__c: {
          value: "2023-05-16",
        },
        Acc_ClaimStatus__c: {
          value: "Approved",
          label: "Payment being processed",
        },
        Acc_PaidDate__c: {
          value: null,
        },
        Acc_ProjectParticipant__r: {
          Id: "a0D2600000zXl72EAC",
        },
        Acc_ProjectPeriodEndDate__c: {
          value: "2023-07-31",
        },
        Acc_ProjectPeriodStartDate__c: {
          value: "2023-07-01",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 3,
        },
        Acc_ProjectPeriodCost__c: {
          value: 500000,
        },
      },
    },
    {
      node: {
        Id: "a0526000009Mc2QAAS",
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
        LastModifiedDate: {
          value: "2023-05-16T15:22:00.000Z",
        },
        Acc_ApprovedDate__c: {
          value: "2023-05-16",
        },
        Acc_ClaimStatus__c: {
          value: "Approved",
          label: "Payment being processed",
        },
        Acc_PaidDate__c: {
          value: null,
        },
        Acc_ProjectParticipant__r: {
          Id: "a0D2600000zXl72EAC",
        },
        Acc_ProjectPeriodEndDate__c: {
          value: "2023-06-30",
        },
        Acc_ProjectPeriodStartDate__c: {
          value: "2023-06-01",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 2,
        },
        Acc_ProjectPeriodCost__c: {
          value: 1000,
        },
        Impact_Management_Participation__c: { value: "Yes" },
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
        Impact_Management_Participation__c: { value: "Yes" },
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
        LastModifiedDate: {
          value: "2023-05-16T15:14:50.000Z",
        },
        Acc_ApprovedDate__c: {
          value: "2023-05-16",
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
        Impact_Management_Participation__c: null,
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
        Acc_ProjectParticipant__r: {
          Id: "a0D2600000zXl72EAC",
        },
        Acc_ProjectPeriodEndDate__c: {
          value: "2023-05-31",
        },
        Impact_Management_Participation__c: { value: "No" },
        RecordType: {
          Name: {
            value: "Total Project Period",
          },
        },
        Acc_ClaimStatus__c: {
          value: "Approved",
          label: "Payment being processed",
        },
        Acc_ProjectPeriodStartDate__c: {
          value: "2023-05-01",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 1,
        },
        Acc_ProjectPeriodCost__c: {
          value: 70,
        },
      },
    },
  ];

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(
      mapToClaimDtoArray(edges, ["id", "isApproved", "periodId", "isFinalClaim", "paidDate"], {}),
    ).toMatchSnapshot();
  });

  it("should map with additional data if statusLabel or forecastCost needed", () => {
    expect(
      mapToClaimDtoArray(
        edges,
        [
          "approvedDate",
          "forecastCost",
          "id",
          "isApproved",
          "isFinalClaim",
          "lastModifiedDate",
          "paidDate",
          "partnerId",
          "periodEndDate",
          "periodId",
          "periodStartDate",
          "status",
          "statusLabel",
          "totalCost",
          "impactManagementParticipation",
        ],
        {
          competitionType: "CR&D",
          periodProfileDetails: [
            {
              forecastCost: 100,
              partnerId: "a0D2600000zXl72EAC" as PartnerId,
              periodId: 1,
            },
            {
              forecastCost: 200,
              partnerId: "a0D2600000zXl72EAC" as PartnerId,
              periodId: 2,
            },
            {
              forecastCost: 300,
              partnerId: "a0D2600000zXl72EAC" as PartnerId,
              periodId: 3,
            },
            {
              forecastCost: 400,
              partnerId: "a0D2600000zXl72EAC" as PartnerId,
              periodId: 12,
            },
            {
              forecastCost: 10000,
              partnerId: "a0D2600000zXl71EAC" as PartnerId,
              periodId: 1,
            },
          ],
        },
      ),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToClaimDtoArray(edges, ["id", "paidDate"], {})).toMatchSnapshot();
  });
});
