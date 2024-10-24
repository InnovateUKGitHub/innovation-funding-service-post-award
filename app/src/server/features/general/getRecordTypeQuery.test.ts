import { GetRecordTypeQuery } from "@server/features/general/getRecordTypeQuery";
import { TestContext } from "@tests/test-utils/testContextProvider";
import { BadRequestError } from "../common/appError";

describe("GetAllRecordTypesQuery", () => {
  it("returns record type", async () => {
    const context = new TestContext();

    const parent = "Parent";
    const type = "Type";
    const developerName = "Acc_Type";

    const expected = context.testData.createRecordType({ parent, type, developerName });

    const query = new GetRecordTypeQuery(parent, type);
    const result = await context.runQuery(query);

    expect(result).toBe(expected);
  });

  it("filters by type", async () => {
    const context = new TestContext();

    const parent = "Parent";

    const data = context.testData.range(3, i =>
      context.testData.createRecordType({ parent, type: "Type" + i, developerName: "Acc_Type" + i }),
    );

    const query = new GetRecordTypeQuery(parent, "Type2");
    const result = await context.runQuery(query);

    expect(result).toBe(data[1]);
  });

  it("filters by parent", async () => {
    const context = new TestContext();

    const type = "Type";
    const developerName = "Acc_Type";

    const data = context.testData.range(3, i =>
      context.testData.createRecordType({ parent: "Parent" + i, type, developerName }),
    );

    const query = new GetRecordTypeQuery("Parent3", type);
    const result = await context.runQuery(query);

    expect(result).toBe(data[2]);
  });

  it("throws if not found", async () => {
    const context = new TestContext();

    const parent = "Parent";
    const type = "Type";
    const developerName = "Acc_Type";

    const record = context.testData.createRecordType({ parent, type, developerName });

    await expect(context.runQuery(new GetRecordTypeQuery(type, parent))).rejects.toThrow(BadRequestError);
    await expect(context.runQuery(new GetRecordTypeQuery(parent, type))).resolves.toBe(record);
  });
});
