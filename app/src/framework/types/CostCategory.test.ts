import { CostCategoryType, CostCategoryList } from ".";

describe("CostCategory", () => {
  it("can map from CostCategoryType", () => {
    const result = CostCategoryList.fromId(CostCategoryType.Loans_costs_for_Industrial_participants);
    expect(result.name).toEqual("Loans costs for Industrial participants");
  });

  it("can map from CostCategory name", () => {
    const result = CostCategoryList.fromName("Knowledge base supervisor");
    expect(result.id).toEqual(CostCategoryType.Knowledge_base_supervisor);
  });

  it("maps an unknown name to the unknown cost type", () => {
    const result = CostCategoryList.fromName("test-unknown-id");
    expect(result.id).toEqual(CostCategoryType.Unknown);
    expect(result.name).toEqual("Unknown Type");
  });

  it("maps an unknown id to the unknown cost type", () => {
    const result = CostCategoryList.fromName(1234567 as any);
    expect(result.id).toEqual(CostCategoryType.Unknown);
    expect(result.name).toEqual("Unknown Type");
  });
});
