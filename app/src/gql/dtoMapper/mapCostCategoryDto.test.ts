import { mapToRequiredSortedCostCategoryDtoArray } from "./mapCostCategoryDto";

describe("mapToRequiredSortedCostCategoryDtoArray", () => {
  const edges = [
    {
      node: {
        Id: "0",
        Acc_CostCategoryName__c: { value: "Labour" },
        Acc_OrganisationType__c: { value: "Academic" },
        Acc_CompetitionType__c: { value: "CR&D" },
        Acc_DisplayOrder__c: { value: 3 },
      },
    },
    {
      node: {
        Id: "1",
        Acc_CostCategoryName__c: { value: "Travel" },
        Acc_OrganisationType__c: { value: "Academic" },
        Acc_CompetitionType__c: { value: "CR&D" },
        Acc_DisplayOrder__c: { value: 2 },
      },
    },
    {
      node: {
        Id: "2",
        Acc_CostCategoryName__c: { value: "Materials" },
        Acc_OrganisationType__c: { value: "Business" },
        Acc_CompetitionType__c: { value: "KTP" },
        Acc_DisplayOrder__c: { value: 1 },
      },
    },
    {
      node: {
        Id: "3",
        Acc_CostCategoryName__c: { value: "Other costs" },
        Acc_OrganisationType__c: { value: "Business" },
        Acc_CompetitionType__c: { value: "Loans" },
        Acc_DisplayOrder__c: { value: 4 },
      },
    },
    {
      node: {
        Id: "4",
        Acc_CostCategoryName__c: { value: "Bananas" },
        Acc_OrganisationType__c: { value: "Business" },
        Acc_CompetitionType__c: { value: "CR&D" },
        Acc_DisplayOrder__c: { value: 5 },
      },
    },
    {
      node: {
        Id: "5",
        Acc_CostCategoryName__c: { value: "Schmoozing" },
        Acc_OrganisationType__c: { value: "Business" },
        Acc_CompetitionType__c: { value: "CR&D" },
        Acc_DisplayOrder__c: { value: 6 },
      },
    },
    {
      node: {
        Id: "6",
        Acc_CostCategoryName__c: { value: "Kickbacks" },
        Acc_OrganisationType__c: { value: "Business" },
        Acc_CompetitionType__c: { value: "CR&D" },
        Acc_DisplayOrder__c: { value: 7 },
      },
    },
  ];

  const profileNode = ["0", "1s", "2", "3"].map(x => ({
    node: {
      Acc_CostCategory__c: {
        value: x,
      },
    },
  }));

  it("should map the gql data to the correct Dtos filtering out for not New and not Claim Detail records", () => {
    expect(
      mapToRequiredSortedCostCategoryDtoArray(
        edges,
        ["id", "name", "displayOrder", "type", "competitionType", "organisationType", "isCalculated"],
        profileNode,
      ),
    ).toMatchSnapshot();
  });

  it("should map the gql data only including fields on the picklist", () => {
    expect(
      mapToRequiredSortedCostCategoryDtoArray(edges, ["id", "name", "displayOrder", "type"], profileNode),
    ).toMatchSnapshot();
  });
});
