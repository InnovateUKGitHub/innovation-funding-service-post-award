import { TestContext } from "../../testContextProvider";
import { GetDocumentsLinkedToRecordQuery } from "../../../../src/server/features/documents/getAllForRecord";

describe("GetClaimDetailDocumentsQuery", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const contentVersion = context.testData.createContentVersion("12345", "cat", "jpg");
    context.testData.createContentDocumentLink(contentVersion.ContentDocumentId, "12345");

    const query = new GetDocumentsLinkedToRecordQuery("12345");
    const result = await context.runQuery(query);
    const item = result[0];

    expect(item.fileName).toBe("cat.jpg");
    expect(item.link).toBe(`/api/documents/${contentVersion.Id}/content`);
  });
});
