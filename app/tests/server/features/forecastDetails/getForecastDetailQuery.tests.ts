import "jest";
import { TestContext } from "../../testContextProvider";
import {GetForecastDetail} from "../../../../src/server/features/forecasts/getForecastDetailQuery";

describe("GetForecastDetailQuery", () => {
  it("returns object of correct shape", async () => {
    const context = new TestContext();
    const costCat = context.testData.createCostCategory();
    const partner = context.testData.createPartner();
    context.testData.createProfileDetail(costCat, partner);

    const query  = new GetForecastDetail(partner.Id, 1, costCat.Id);
    const item = await context.runQuery(query);

    expect(item.costCategoryId).toBe(costCat.Id);
    expect(item.periodId).toBe(1);
    expect(item.value).toBe(1000);
  });
});
