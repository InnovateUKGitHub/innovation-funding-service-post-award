import {TestContext} from "../../testContextProvider";
import {GetDocumentQuery} from "../../../../src/server/features/documents/getDocument";

describe("GetDocumentQuery", () => {
  it("returns a document", async () => {
    const context = new TestContext();
    const contentVersion = context.testData.createContentVersion("12345", "cat", "jpg");

    const query = new GetDocumentQuery(contentVersion.Id);
    const result = await context.runQuery(query);
    const streamResponse = result;

    expect(streamResponse).toBeDefined();

    let resp = "";
    streamResponse.on("data", (chunk) => {
      resp += chunk;
    });

    return new Promise((resolve) => {
      streamResponse.on("end", () => {
        expect(resp).toBe(contentVersion.Id );
        resolve();
      });
    });
  });
});
