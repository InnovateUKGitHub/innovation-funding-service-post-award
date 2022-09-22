import { CostCategoryType, CostCategoryList } from ".";

describe("CostCategory", () => {
  describe("with default competition type", () => {
    const costCategoryList = new CostCategoryList();

    it("can map from CostCategoryType", () => {
      const result = costCategoryList.fromId(CostCategoryType.Loans_costs_for_Industrial_participants);
      expect(result.name).toEqual("Loans costs for Industrial participants");
    });

    it("can map from CostCategory name", () => {
      const result = costCategoryList.fromName("Knowledge base supervisor");
      expect(result.id).toEqual(CostCategoryType.Knowledge_base_supervisor);
    });

    it("maps an unknown name to the unknown cost type", () => {
      const result = costCategoryList.fromName("test-unknown-id");
      expect(result.id).toEqual(CostCategoryType.Unknown);
      expect(result.name).toEqual("Unknown Type");
    });

    it("maps an unknown id to the unknown cost type", () => {
      const result = costCategoryList.fromName(1234567 as any);
      expect(result.id).toEqual(CostCategoryType.Unknown);
      expect(result.name).toEqual("Unknown Type");
    });
  });
});
