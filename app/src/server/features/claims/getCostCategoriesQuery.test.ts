import { TestContext } from "@tests/test-utils/testContextProvider";
import { GetUnfilteredCostCategoriesQuery, GetFilteredCostCategoriesQuery } from "./getCostCategoriesQuery";

describe("GetUnfilteredCostCategoriesQuery", () => {
  test("returns all categories", async () => {
    const context = new TestContext();
    const testData = context.testData;
    testData.range(5, () => testData.createCostCategory());

    const query = new GetUnfilteredCostCategoriesQuery();
    const result = await context.runQuery(query);
    expect(result.length).toBe(5);
  });

  test("sorts by display order", async () => {
    const context = new TestContext();
    const data = context.testData
      .range(5, i => ({ order: 5 + 1 - i }))
      .map(x =>
        context.testData.createCostCategory({
          displayOrder: x.order,
          name: "Item " + x.order,
        }),
      );

    const query = new GetUnfilteredCostCategoriesQuery();
    const result = await context.runQuery(query);

    expect(result.length).toBe(5);
    expect(data.map(x => x.name)).toEqual(["Item 5", "Item 4", "Item 3", "Item 2", "Item 1"]);
    expect(result.map(x => x.name)).toEqual(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]);
  });
});

describe("GetFilteredCostCategoriesQuery", () => {
  test("returns filtered categories", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const partner = testData.createPartner();

    const numInitialCostCategories = 5;
    testData.range(numInitialCostCategories, () => testData.createProfileDetail(undefined, partner));
    testData.range(10, () => testData.createCostCategory());

    const query = new GetFilteredCostCategoriesQuery(partner.id);
    const result = await context.runQuery(query);
    expect(result).toHaveLength(numInitialCostCategories);
  });

  test("sorts filtered cost categories", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const partner = testData.createPartner();

    testData.range(2, () => testData.createProfileDetail(undefined, partner));
    testData.range(3, () => testData.createCostCategory());

    const query = new GetFilteredCostCategoriesQuery(partner.id);
    const result = await context.runQuery(query);
    expect(result).toHaveLength(2);
    expect(result[0].id).toStrictEqual("CostCat1");
    expect(result[1].id).toStrictEqual("CostCat2");
    expect(result[2]).toBeUndefined();
  });
});
