import { mapToClaimDetailsDtoArray } from "./mapClaimDetailsDto";

describe("mapToClaimDetailsArray", () => {
  const edges = [
    {
      node: {
        Acc_CostCategory__c: {
          value: "category-id-0",
        },
        Acc_ProjectPeriodStartDate__c: {
          value: "2020-01-21",
        },
        Acc_ProjectPeriodEndDate__c: {
          value: "2020-03-21",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 2,
        },
        Acc_PeriodCostCategoryTotal__c: {
          value: 10000,
        },
        Acc_ClaimStatus__c: {
          value: "Current",
        },
        RecordType: {
          DeveloperName: {
            value: "Claims_Detail",
          },
        },
      },
    },
    {
      node: {
        Acc_CostCategory__c: {
          value: "category-id-1",
        },
        Acc_ProjectPeriodStartDate__c: {
          value: "2020-01-21",
        },
        Acc_ProjectPeriodEndDate__c: {
          value: "2020-03-21",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 3,
        },
        Acc_PeriodCostCategoryTotal__c: {
          value: 10000,
        },
        Acc_ClaimStatus__c: {
          value: "Current",
        },
        RecordType: {
          DeveloperName: {
            value: "Claims_Detail",
          },
        },
      },
    },
    {
      node: {
        Acc_CostCategory__c: {
          value: "category-defaults",
        },
        Acc_ProjectPeriodStartDate__c: null,
        Acc_ProjectPeriodEndDate__c: null,
        Acc_ProjectPeriodNumber__c: null,
        Acc_PeriodCostCategoryTotal__c: null,
        Acc_ClaimStatus__c: {
          value: "Current",
        },
        RecordType: {
          DeveloperName: {
            value: "Claims_Detail",
          },
        },
      },
    },
    {
      node: {
        Acc_CostCategory__c: {
          value: null,
        },
        Acc_ProjectPeriodStartDate__c: null,
        Acc_ProjectPeriodEndDate__c: null,
        Acc_ProjectPeriodNumber__c: null,
        Acc_PeriodCostCategoryTotal__c: null,
        Acc_ClaimStatus__c: {
          value: "Current",
        },
        RecordType: {
          DeveloperName: {
            value: "Claims_Detail",
          },
        },
      },
    },
    {
      node: {
        Acc_CostCategory__c: {
          value: "category-id-1",
        },
        Acc_ProjectPeriodStartDate__c: {
          value: "2020-01-21",
        },
        Acc_ProjectPeriodEndDate__c: {
          value: "2020-03-21",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 3,
        },
        Acc_PeriodCostCategoryTotal__c: {
          value: 10000,
        },
        Acc_ClaimStatus__c: {
          value: "New",
        },
        RecordType: {
          DeveloperName: {
            value: "Claims_Detail",
          },
        },
      },
    },
    {
      node: {
        Acc_CostCategory__c: {
          value: "category-id-1",
        },
        Acc_ProjectPeriodStartDate__c: {
          value: "2020-01-21",
        },
        Acc_ProjectPeriodEndDate__c: {
          value: "2020-03-21",
        },
        Acc_ProjectPeriodNumber__c: {
          value: 3,
        },
        Acc_PeriodCostCategoryTotal__c: {
          value: 10000,
        },
        Acc_ClaimStatus__c: {
          value: "Current",
        },
        RecordType: {
          DeveloperName: {
            value: "Random",
          },
        },
      },
    },
  ];

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(
      mapToClaimDetailsDtoArray(edges, ["costCategoryId", "periodEnd", "periodId", "periodStart", "value"], {}),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToClaimDetailsDtoArray(edges, ["costCategoryId", "value"], {})).toMatchSnapshot();
  });
});
