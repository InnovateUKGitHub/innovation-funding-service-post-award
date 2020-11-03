
import { TestContext } from "../../testContextProvider";
import {GetForecastDetailQuery} from "../../../../src/server/features/forecastDetails/getForecastDetailQuery";

describe("GetForecastDetailQuery", () => {
  it("returns object of correct shape", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    context.testData.createProfileDetail(costCat, partner);

    const query  = new GetForecastDetailQuery(partner.id, 1, costCat.id);
    const item = await context.runQuery(query);

    expect(item.costCategoryId).toBe(costCat.id);
    expect(item.periodId).toBe(1);
    expect(item.value).toBe(1000);
  });

  it("should return zero value if partner does not exist", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    context.testData.createProfileDetail(costCat, partner);

    const query  = new GetForecastDetailQuery("test", 1, costCat.id);
    const item = await context.runQuery(query);

    expect(item.costCategoryId).toBe(costCat.id);
    expect(item.periodId).toBe(1);
    expect(item.value).toBe(0);
  });
});
