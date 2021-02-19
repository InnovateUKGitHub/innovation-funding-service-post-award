import { GetAllRecordTypesQuery } from "@server/features/general/getAllRecordTypesQuery";
import { TestContext } from "../../testContextProvider";

describe("GetAllRecordTypesQuery", () => {
  it("returns all record types", async () => {
    const context = new TestContext();

    const expected = context.testData.range(5, () => context.testData.createRecordType());

    const query  =  new GetAllRecordTypesQuery();
    const result = await context.runQuery(query);

    expect(result).toEqual(expected);
  });
});
