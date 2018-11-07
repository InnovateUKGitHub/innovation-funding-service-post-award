import {TestContext} from "../../testContextProvider";
import {DeleteDocumentCommand} from "../../../../src/server/features/documents/deleteDocument";

describe("DeleteDocumentCommand", () => {
  it("should upload and then delete a document", async () => {
    const context = new TestContext();
    const contentVersion = context.testData.createContentVersion("34", "hello", "txt", "hello");
    expect(context.repositories.contentDocument.Items).toHaveLength(1);

    const deleteCommand = new DeleteDocumentCommand(contentVersion.ContentDocumentId);
    await context.runCommand(deleteCommand);
    expect(context.repositories.contentDocument.Items).toHaveLength(0);
  });
});
