import { mapToGolCostDtoArray } from "./mapGolCostsDto";

describe("mapToGolCostDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "0",
        Acc_CostCategory__c: { value: "0" },
        Acc_CostCategoryGOLCost__c: { value: 1000 },
        RecordType: {
          Name: {
            value: "Total Cost Category",
          },
        },
      },
    },
    {
      node: {
        Id: "1",
        Acc_CostCategory__c: { value: "2" },
        Acc_CostCategoryGOLCost__c: { value: 1000 },
        RecordType: {
          Name: {
            value: "Total Cost Category",
          },
        },
      },
    },
    {
      node: {
        Id: "3",
        Acc_CostCategory__c: null,
        Acc_CostCategoryGOLCost__c: null,
        RecordType: {
          Name: {
            value: "Total Cost Category",
          },
        },
      },
    },
    {
      node: {
        Id: "4",
        Acc_CostCategory__c: { value: "Kickbacks" },
        Acc_CostCategoryGOLCost__c: { value: 1000 },
        RecordType: {
          Name: {
            value: "blah",
          },
        },
      },
    },
  ];

  const costCategories = [
    {
      competitionType: "KTP",
      displayOrder: 1,
      id: "2" as CostCategoryId,
      isCalculated: false,
      name: "Materials",
      organisationType: "Business",
      type: 6,
    },
    {
      competitionType: "CR&D",
      displayOrder: 3,
      id: "0" as CostCategoryId,
      isCalculated: false,
      name: "Labour",
      organisationType: "Academic",
      type: 2,
    },
    {
      competitionType: "Loans",
      displayOrder: 4,
      id: "3" as CostCategoryId,
      isCalculated: false,
      name: "Other costs",
      organisationType: "Business",
      type: 10,
    },
  ];

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(
      mapToGolCostDtoArray(edges, ["costCategoryId", "costCategoryName", "value"], costCategories),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(mapToGolCostDtoArray(edges, ["costCategoryId"], costCategories)).toMatchSnapshot();
  });
});
