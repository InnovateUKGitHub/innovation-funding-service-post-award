import { TestContext } from "../../testContextProvider";
import { GetCostCategoriesQuery } from "../../../../src/server/features/claims";

describe("GetCostCategoriesQuery", () => {
    it("when valid then returns all categories", async () => {
        const context = new TestContext();
        const testData = context.testData;

        testData.range(5, _ => testData.createCostCategory());

        const query = new GetCostCategoriesQuery();

        const result = await context.runQuery(query);

        expect(result.length).toBe(5);
    });

    it("Sorts by display order", async () => {
        const context = new TestContext();
        const data = context.testData.range(5, (i) => context.testData.createCostCategory(x => {
            const order = 5 + 1 - i;
            x.Acc_DisplayOrder__c = order;
            x.Acc_CostCategoryName__c = "Item " + order;
        }));

        const query = new GetCostCategoriesQuery();
        const result = await context.runQuery(query);

        expect(result.length).toBe(5);
        expect(data.map(x => x.Acc_CostCategoryName__c)).toEqual(["Item 5", "Item 4", "Item 3", "Item 2", "Item 1"]);
        expect(result.map(x => x.name)).toEqual(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]);

    });

});
