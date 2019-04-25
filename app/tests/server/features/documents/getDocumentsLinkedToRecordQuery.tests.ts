import { TestContext } from "../../testContextProvider";
import { GetDocumentsLinkedToRecordQuery } from "../../../../src/server/features/documents/getAllForRecord";

describe("GetDocumentsLinkedToRecord", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const document = context.testData.createDocument("12345", "cat", "jpg");

    const query = new GetDocumentsLinkedToRecordQuery("12345");
    const result = await context.runQuery(query);
    const item = result[0];

    expect(item.fileName).toBe("cat.jpg");
    expect(item.link).toBe(`/api/documents/${document.Id}/content`);
  });

  it("returns a file without file type", async () => {
    const context = new TestContext();
    context.testData.createDocument("12345", "cat", null);

    const query = new GetDocumentsLinkedToRecordQuery("12345");
    const result = await context.runQuery(query);
    const item = result[0];

    expect(item.fileName).toBe("cat");
  });
});
