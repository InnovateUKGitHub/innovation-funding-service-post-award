import { GetAllQuery } from "../../../../src/server/features/contacts/getAllQuery";
import { TestContext } from "../../testContextProvider";

describe("getAllQuery", () => {
    it("when valid then returns all", async () => {
        const context = new TestContext();
        const testData = context.testData;

        const data = testData.range(10, i => testData.createContact());

        const query = new GetAllQuery();

        const result = await context.runQuery(query);

        expect(result).not.toBe(null);
        expect(result.map(x => x.id)).toMatchObject(data.map(x => x.Id));
    });
});
