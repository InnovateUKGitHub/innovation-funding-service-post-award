import { GetByIdQuery } from "../../../../src/server/features/contacts/getByIdQuery";
import { TestContext } from "../../testContextProvider";

describe("getByIdQuery", () => {
    it("when valid id then correct object", async () => {
        const context = new TestContext();
        const testData = context.testData;

        const data = testData.range(10, i => testData.createContact());
        const expected = data[5];

        const query = new GetByIdQuery(expected.Id);
        const result = (await context.runQuery(query))!;

        expect(result).not.toBe(null);
        expect(result.id).toBe(expected.Id);
        expect(result.firstName).toBe(expected.FirstName);
        expect(result.lastName).toBe(expected.LastName);
    });
});
