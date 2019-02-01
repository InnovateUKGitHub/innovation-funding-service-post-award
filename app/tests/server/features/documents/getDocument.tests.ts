import {TestContext} from "../../testContextProvider";
import {GetDocumentQuery} from "../../../../src/server/features/documents/getDocument";

describe("GetDocumentQuery", () => {
  it("returns a stream", async () => {
    const context = new TestContext();
    const contentVersion = context.testData.createContentVersion("12345", "cat", "jpg");

    const query = new GetDocumentQuery(contentVersion.Id);
    const result = await context.runQuery(query);

    expect(result).toBeDefined();
    expect(result.fileType).toBe("jpg");
    expect(result.contentLength).toBe(2);
    const streamResponse = result.stream;
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

  it("returns a file without file type", async () => {
    const context = new TestContext();
    const contentVersion = context.testData.createContentVersion("12345", "cat", null);

    const query = new GetDocumentQuery(contentVersion.Id);
    const result = await context.runQuery(query);

    expect(result).toBeDefined();
    expect(result.fileType).toBe(null);
  });
});
