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
        const data = context.testData.range(5, (i) => ({ order: 5 + 1 - i})).map(x => context.testData.createCostCategory({
            displayOrder: x.order,
            name: "Item " + x.order,
        }));

        const query = new GetCostCategoriesQuery();
        const result = await context.runQuery(query);

        expect(result.length).toBe(5);
        expect(data.map(x => x.name)).toEqual(["Item 5", "Item 4", "Item 3", "Item 2", "Item 1"]);
        expect(result.map(x => x.name)).toEqual(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]);

    });
});
