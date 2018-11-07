import {TestContext} from "../../testContextProvider";
import {UploadDocumentCommand} from "../../../../src/server/features/documents/uploadDocument";

describe("UploadDocumentCommand", () => {
  const docToUpload = {content: "Hello world", fileName: "hello.txt"};
  const recordId = "TESTid";
  it("should store a document and contentVersions", async () => {
    const context = new TestContext();

    const command = new UploadDocumentCommand(docToUpload, recordId);
    await context.runCommand(command);

    expect(context.repositories.contentVersions.Items).toHaveLength(1);
  });

  it("should store a document and contentDocumentLink", async () => {
    const context = new TestContext();

    const command = new UploadDocumentCommand(docToUpload, recordId);
    await context.runCommand(command);

    expect(context.repositories.contentDocumentLinks.Items).toHaveLength(1);
  });

  it("should have the correct content in contentVersions", async () => {
    const context = new TestContext();

    const command = new UploadDocumentCommand(docToUpload, recordId);
    await context.runCommand(command);

    const document = (context.repositories.contentVersions.Items[0]);

    expect(document.VersionData).toEqual(docToUpload.content);
    expect(document.PathOnClient).toEqual(docToUpload.fileName);
  });

  it("should have the correct content in contentDocumentLinks", async () => {
    const context = new TestContext();

    const command = new UploadDocumentCommand(docToUpload, recordId);
    await context.runCommand(command);

    const document = (context.repositories.contentDocumentLinks.Items[0]);

    expect(document.LinkedEntityId).toEqual(recordId);
  });

});
