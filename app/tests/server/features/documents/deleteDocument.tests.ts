import {TestContext} from "../../testContextProvider";
import {DeleteDocumentCommand} from "../../../../src/server/features/documents/deleteDocument";

describe("DeleteDocumentCommand", () => {
  it("should upload and then delete a document", async () => {
    const context = new TestContext();
    const document = context.testData.createDocument("34", "hello", "txt", "hello");
    expect(context.repositories.documents.Items).toHaveLength(1);

    const deleteCommand = new DeleteDocumentCommand(document.ContentDocumentId);
    await context.runCommand(deleteCommand);
    expect(context.repositories.documents.Items).toHaveLength(0);
  });
});
