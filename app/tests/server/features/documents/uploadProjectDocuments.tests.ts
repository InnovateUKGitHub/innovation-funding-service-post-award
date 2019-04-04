import { TestContext } from "../../testContextProvider";
import { UploadProjectDocumentCommand } from "../../../../src/server/features/documents/uploadProjectDocument";
import { ValidationError } from "../../../../src/server/features/common/appError";

describe("UploadProjectDocumentCommand", () => {
  it("should upload a project document", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const file = {
      fileName: "fileName.txt",
      content: "Some content",
    };

    const command = new UploadProjectDocumentCommand(project.Id, file);
    await context.runCommand(command);

    expect(context.repositories.contentVersions.Items[0].VersionData).toEqual(file.content);
    expect(context.repositories.contentVersions.Items[0].PathOnClient).toEqual(file.fileName);
    expect(context.repositories.contentDocumentLinks.Items[0].LinkedEntityId).toEqual(project.Id);
  });

  it("should throw a validation exception", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const file = {
      fileName: undefined,
      content: "Some content",
    };

    const command = new UploadProjectDocumentCommand(project.Id, file as any);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });
});
