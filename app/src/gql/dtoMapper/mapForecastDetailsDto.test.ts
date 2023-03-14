import { mapToForecastDetailsDtoArray } from "./mapForecastDetailsDto";

describe("mapToForecastDetailsDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "0",
        Acc_CostCategory__c: { value: "Labour" },
        Acc_ProjectPeriodStartDate__c: { value: "2021-01-25" },
        Acc_ProjectPeriodEndDate__c: { value: "2021-03-25" },
        Acc_ProjectPeriodNumber__c: { value: 3 },
        Acc_LatestForecastCost__c: { value: 1000 },
        RecordType: {
          Name: {
            value: "Profile Detail",
          },
        },
      },
    },
    {
      node: {
        Id: "1",
        Acc_CostCategory__c: { value: "Travel" },
        Acc_ProjectPeriodStartDate__c: { value: "2021-01-25" },
        Acc_ProjectPeriodEndDate__c: { value: "2021-03-25" },
        Acc_ProjectPeriodNumber__c: { value: 2 },
        Acc_LatestForecastCost__c: { value: 1000 },
        RecordType: {
          Name: {
            value: "Profile Detail",
          },
        },
      },
    },
    {
      node: {
        Id: "3",
        Acc_CostCategory__c: null,
        Acc_ProjectPeriodStartDate__c: null,
        Acc_ProjectPeriodEndDate__c: null,
        Acc_ProjectPeriodNumber__c: null,
        Acc_LatestForecastCost__c: null,
        RecordType: {
          Name: {
            value: "Profile Detail",
          },
        },
      },
    },
    {
      node: {
        Id: "4",
        Acc_CostCategory__c: { value: "Kickbacks" },
        Acc_ProjectPeriodStartDate__c: { value: "Business" },
        Acc_ProjectPeriodEndDate__c: { value: "CR&D" },
        Acc_ProjectPeriodNumber__c: { value: 7 },
        Acc_LatestForecastCost__c: { value: 1000 },
        RecordType: {
          Name: {
            value: "blah",
          },
        },
      },
    },
  ];

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(
      mapToForecastDetailsDtoArray(edges, ["id", "costCategoryId", "periodId", "periodStart", "periodEnd", "value"]),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToForecastDetailsDtoArray(edges, ["id", "periodId", "value"])).toMatchSnapshot();
  });
});
