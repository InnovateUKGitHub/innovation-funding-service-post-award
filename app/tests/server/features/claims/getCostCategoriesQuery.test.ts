import { TestContext } from "../../testContextProvider";
import { GetCostCategoriesQuery } from "../../../../src/server/features/claims/getCostCategoriesQuery";

describe('GetCostCategoriesQuery', () => {
    it('when valid then returns all categories', async () => {
        let context = new TestContext();
        let testData = context.testData;

        testData.range(5, _ => testData.createCostCategory())

        let query = new GetCostCategoriesQuery();

        let result = await context.runQuery(query);

        expect(result.length).toBe(5)
    })
});


