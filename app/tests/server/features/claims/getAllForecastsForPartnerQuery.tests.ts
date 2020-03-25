import "jest";
import { TestContext } from "../../testContextProvider";
import { GetAllForecastsForPartnerQuery } from "../../../../src/server/features/forecastDetails";

describe("GetAllForecastsForPartnerQuery", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    context.testData.createProfileDetail(costCat, partner);

    const query  = new GetAllForecastsForPartnerQuery(partner.id);
    const result = await context.runQuery(query);
    const item   = result[0];

    expect(item.costCategoryId).toBe(costCat.id);
    expect(item.periodId).toBe(1);
    expect(item.value).toBe(1000);
  });

  it("returns array with single result", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    context.testData.createProfileDetail(costCat, partner);

    const query  = new GetAllForecastsForPartnerQuery(partner.id);
    const result = await context.runQuery(query);

    expect(result.length).toBe(1);
  });

  it("returns array with multiple results", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    context.testData.createProfileDetail(costCat, partner);
    context.testData.createProfileDetail(costCat, partner);
    context.testData.createProfileDetail(costCat, partner);

    const query  = new GetAllForecastsForPartnerQuery(partner.id);
    const result = await context.runQuery(query);

    expect(result.length).toBe(3);
  });
});
