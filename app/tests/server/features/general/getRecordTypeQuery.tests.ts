import { TestContext } from "../../testContextProvider";
import { GetRecordTypeQuery } from "@server/features/general/getRecordTypeQuery";
import { BadRequestError } from "@server/features/common";

describe("GetAllRecordTypesQuery", () => {
  it("returns record type", async () => {
    const context = new TestContext();

    const parent = "Parent";
    const type = "Type";

    const expected = context.testData.createRecordType({parent, type});

    const query  =  new GetRecordTypeQuery(parent, type);
    const result = await context.runQuery(query);

    expect(result).toBe(expected);
  });

  it("filters by type", async () => {
    const context = new TestContext();

    const parent = "Parent";

    const data = context.testData.range(3, i => context.testData.createRecordType({parent, type : "Type" + i }));

    const query  =  new GetRecordTypeQuery(parent, "Type2");
    const result = await context.runQuery(query);

    expect(result).toBe(data[1]);
  });

  it("filters by parent", async () => {
    const context = new TestContext();

    const type = "Type";

    const data = context.testData.range(3, i => context.testData.createRecordType({parent : "Parent" + i, type }));

    const query  =  new GetRecordTypeQuery("Parent3", type);
    const result = await context.runQuery(query);

    expect(result).toBe(data[2]);
  });

  it("throws if not found", async () => {
    const context = new TestContext();

    const parent = "Parent";
    const type = "Type";

    const record = context.testData.createRecordType({ parent, type });

    await expect(context.runQuery(new GetRecordTypeQuery(type, parent))).rejects.toThrow(BadRequestError);
    await expect(context.runQuery(new GetRecordTypeQuery(parent, type))).resolves.toBe(record);
  });
});
