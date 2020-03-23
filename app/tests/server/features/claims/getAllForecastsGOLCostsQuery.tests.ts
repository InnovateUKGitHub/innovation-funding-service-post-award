import "jest";
import { TestContext } from "../../testContextProvider";
import { GetAllForecastsGOLCostsQuery } from "../../../../src/server/features/claims";

describe("GetAllForecastsForPartnerQuery", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    context.testData.createProfileTotalCostCategory(costCat, partner);

    const query  = new GetAllForecastsGOLCostsQuery(partner.id);
    const result = await context.runQuery(query);
    const item   = result[0];

    expect(item.costCategoryId).toBe(costCat.id);
    expect(item.value).toBe(100);
  });

  it("returns array with single result", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    context.testData.createProfileTotalCostCategory(costCat, partner);

    const query  = new GetAllForecastsGOLCostsQuery(partner.id);
    const result = await context.runQuery(query);

    expect(result.length).toBe(1);
  });

  it("returns array with multiple results", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    context.testData.createProfileTotalCostCategory(costCat, partner);
    context.testData.createProfileTotalCostCategory(costCat, partner);
    context.testData.createProfileTotalCostCategory(costCat, partner);

    const query  = new GetAllForecastsGOLCostsQuery(partner.id);
    const result = await context.runQuery(query);

    expect(result.length).toBe(3);
  });
});
