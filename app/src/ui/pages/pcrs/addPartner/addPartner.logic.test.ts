import { getInitialAcademicCosts } from "./addPartner.logic";

describe("getInitialAcademicCosts", () => {
  const spendProfile = {
    pcrItemId: "a0GAd000000to0zMAA" as PcrItemId,
    costs: [
      {
        id: "a08Ad00000BWIzzIAH" as CostId,
        costCategoryId: "a0626000007qoT1AAI" as CostCategoryId,
        value: 10000,
        description: "Directly incurred - Staff",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ00IAH" as CostId,
        costCategoryId: "a0626000007qoT2AAI" as CostCategoryId,
        value: 5000,
        description: "Directly incurred - Travel and subsistence",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ01IAH" as CostId,
        costCategoryId: "a0626000007qoT3AAI" as CostCategoryId,
        value: 2000,
        description: "Directly incurred - Equipment",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ02IAH" as CostId,
        costCategoryId: "a0626000007qoT4AAI" as CostCategoryId,
        value: 1000,
        description: "Directly incurred - Other costs",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ03IAH" as CostId,
        costCategoryId: "a0626000007qoT5AAI" as CostCategoryId,
        value: 500,
        description: "Directly allocated - Investigations",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ04IAH" as CostId,
        costCategoryId: "a0626000007qoT6AAI" as CostCategoryId,
        value: 0,
        description: "Directly allocated - Estates costs",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ05IAH" as CostId,
        costCategoryId: "a0626000007qoT7AAI" as CostCategoryId,
        value: 0,
        description: "Directly allocated - Other costs",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ06IAH" as CostId,
        costCategoryId: "a0626000007qoQpAAI" as CostCategoryId,
        value: 0,
        description: "Indirect costs - Investigations",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ07IAH" as CostId,
        costCategoryId: "a0626000007qoQqAAI" as CostCategoryId,
        value: 0,
        description: "Exceptions - Staff",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ08IAH" as CostId,
        costCategoryId: "a0626000007qoQrAAI" as CostCategoryId,
        value: 0,
        description: "Exceptions - Travel and subsistence",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ09IAH" as CostId,
        costCategoryId: "a0626000007qoQsAAI" as CostCategoryId,
        value: 0,
        description: "Exceptions - Equipment",
        costCategory: 2,
      },
      {
        id: "a08Ad00000BWJ0AIAX" as CostId,
        costCategoryId: "a0626000007qoQtAAI" as CostCategoryId,
        value: 0,
        description: "Exceptions - Other costs",
        costCategory: 2,
      },
    ],
    funds: [],
  };

  const academicCostCategories = [
    {
      id: "a0626000007qoT1AAI" as CostCategoryId,
      name: "Directly incurred - Staff",
      displayOrder: 8,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoT2AAI" as CostCategoryId,
      name: "Directly incurred - Travel and subsistence",
      displayOrder: 9,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoT3AAI" as CostCategoryId,
      name: "Directly incurred - Equipment",
      displayOrder: 10,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoT4AAI" as CostCategoryId,
      name: "Directly incurred - Other costs",
      displayOrder: 11,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoT5AAI" as CostCategoryId,
      name: "Directly allocated - Investigations",
      displayOrder: 12,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoT6AAI" as CostCategoryId,
      name: "Directly allocated - Estates costs",
      displayOrder: 13,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoT7AAI" as CostCategoryId,
      name: "Directly allocated - Other costs",
      displayOrder: 14,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoQpAAI" as CostCategoryId,
      name: "Indirect costs - Investigations",
      displayOrder: 15,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoQqAAI" as CostCategoryId,
      name: "Exceptions - Staff",
      displayOrder: 16,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoQrAAI" as CostCategoryId,
      name: "Exceptions - Travel and subsistence",
      displayOrder: 17,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoQsAAI" as CostCategoryId,
      name: "Exceptions - Equipment",
      displayOrder: 18,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoQtAAI" as CostCategoryId,
      name: "Exceptions - Other costs",
      displayOrder: 19,
      type: 2,
      competitionType: "CR&D",
      organisationType: "Academic",
    },
    {
      id: "a0626000007qoRSAAY" as CostCategoryId,
      name: "Other public sector funding",
      displayOrder: 91,
      type: 11,
      competitionType: "unknown",
      organisationType: "unknown",
    },
  ];

  const emptySpendProfile = {
    pcrItemId: "a0GAd00000118e5MAA" as PcrItemId,
    costs: [],
    funds: [],
  };

  it("should return the formatted initial academic costs without other public sector funding if there are already costs saved", () => {
    expect(getInitialAcademicCosts(spendProfile, academicCostCategories)).toMatchSnapshot();
  });

  it("should initialise an empty spend profile with default values", () => {
    expect(getInitialAcademicCosts(emptySpendProfile, academicCostCategories)).toMatchSnapshot();
  });

  it("should sort the costs accurately even if the data is not consistently ordered", () => {
    const initialCosts = getInitialAcademicCosts(spendProfile, academicCostCategories);
    const initialCostsWithRandomOrder = getInitialAcademicCosts(
      spendProfile,
      academicCostCategories.sort(() => Math.random() - 0.5),
    );

    expect(initialCosts).toEqual(initialCostsWithRandomOrder);
  });
});
