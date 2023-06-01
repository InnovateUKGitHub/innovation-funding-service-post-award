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
      },
    },
    {
      node: {
        Id: "a0526000009Mc2PAAS",
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
          value: "2023-05-31",
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
        ],
        {
          competitionType: "CR&D",
          periodProfileDetails: [
            {
              forecastCost: 123456,
              partnerId: "a0D2600000zXl72EAC" as PartnerId,
            },
            {
              forecastCost: 10000,
              partnerId: "a0D2600000zXl71EAC" as PartnerId,
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
