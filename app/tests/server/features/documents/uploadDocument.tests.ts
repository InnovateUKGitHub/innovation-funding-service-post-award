import {TestContext} from "../../testContextProvider";
import {UploadDocumentCommand} from "../../../../src/server/features/documents/uploadDocument";

describe("UploadDocumentCommand", () => {
  const docToUpload = {content: "Hello world", fileName: "hello.txt"};
  const recordId = "TESTid";
  it("should store a document", async () => {
    const context = new TestContext();

    const command = new UploadDocumentCommand(docToUpload, recordId);
    await context.runCommand(command);

    expect(context.repositories.documents.Items).toHaveLength(1);
  });

  it("should have the correct content in the document", async () => {
    const context = new TestContext();

    const command = new UploadDocumentCommand(docToUpload, recordId);
    const documentId = await context.runCommand(command);

    const document = await context.repositories.documents.getDocumentMetadata(documentId);

    expect(document.VersionData).toEqual(docToUpload.content);
    expect(document.PathOnClient).toEqual(docToUpload.fileName);
  });
});
