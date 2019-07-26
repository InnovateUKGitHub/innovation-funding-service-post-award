// tslint:disable: no-identical-functions

import { TestContext } from "../../testContextProvider";
import { UploadProjectDocumentCommand } from "@server/features/documents/uploadProjectDocument";
import { ValidationError } from "@server/features/common/appError";
import { Authorisation, ProjectRole } from "@framework/types";
import { TestFileWrapper } from "../../testData";

describe("UploadProjectDocumentCommand", () => {
  it("should upload a project document", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const content = "Some content";
    const fileName = "test.csv";

    const file = context.testData.createFile(content, fileName);

    const command = new UploadProjectDocumentCommand(project.Id, { files: [file] });
    const documentIds = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentIds[0]);

    expect(document.VersionData).toEqual(content);
    expect(document.PathOnClient).toEqual(fileName);
  });

  it("should upload a project document description", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const expectedDescription = "Expected Description";

    const file = context.testData.createFile();

    const command = new UploadProjectDocumentCommand(project.Id, { files: [file], description: expectedDescription });
    const documentIds = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentIds[0]);

    expect(document.Description).toEqual(expectedDescription);
  });

  it("should upload muliple documents", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const files = context.testData.range(3, i => context.testData.createFile(`File ${i}`, `test${i}.txt`));
    const expectedDescription = "Expected Description";

    const command = new UploadProjectDocumentCommand(project.Id, { files, description: expectedDescription });
    const documentIds = await context.runCommand(command);
    expect(documentIds.length).toBe(3);

    const documents = await Promise.all(documentIds.map(x => context.repositories.documents.getDocumentMetadata(x)));
    expect(documents.map(x => x.VersionData)).toEqual(files.map(f => f.content));
    expect(documents.map(x => x.PathOnClient)).toEqual(files.map(f => f.fileName));
    expect(documents.map(x => x.Description)).toEqual(files.map(f => expectedDescription));
  });

  it("should upload throw validation error if file has no content", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const files = context.testData.range(3, i => context.testData.createFile(`File ${i}`, `test${i}.txt`));

    files[1].content = null as any;

    const command = new UploadProjectDocumentCommand(project.Id, { files });

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should upload throw validation error if content to large", async () => {
    const context = new TestContext();
    context.config.maxFileSize = 10;
    const project = context.testData.createProject();

    const content = context.testData.range(context.config.maxFileSize + 1, () => "a").join("");

    const files = [context.testData.createFile(content)];

    const command = new UploadProjectDocumentCommand(project.Id, { files });

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should upload muliple project documents", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const content = "Some content";
    const fileName = "test.csv";

    const file = context.testData.createFile(content, fileName);

    const command = new UploadProjectDocumentCommand(project.Id, { files: [file] });
    const documentIds = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentIds[0]);

    expect(document.VersionData).toEqual(content);
    expect(document.PathOnClient).toEqual(fileName);
  });

  it("should handle empty document in array", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const file1 = context.testData.createFile();
    const empty: IFileWrapper = new TestFileWrapper(undefined as any, undefined as any);
    const file2 = context.testData.createFile();

    const files = [file1, empty, file2];

    const command = new UploadProjectDocumentCommand(project.Id, { files });
    const documentIds = await context.runCommand(command);
    expect(documentIds.length).toBe(2);
  });

  it("should throw valdiation error if too many documents", async () => {
    const context = new TestContext();
    context.config.maxUploadFileCount = 3;

    const project = context.testData.createProject();

    const files = context.testData.range(context.config.maxUploadFileCount + 1, () => context.testData.createFile());

    const command = new UploadProjectDocumentCommand(project.Id, { files });
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should throw a validation exception if file name not set", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const file = context.testData.createFile();
    file.fileName = undefined as any;

    const command = new UploadProjectDocumentCommand(project.Id, { files: [file] });
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should throw a validation exception if no files", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const command = new UploadProjectDocumentCommand(project.Id, { files: [] });
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  test("accessControl - Project Monitoring officer passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const command = new UploadProjectDocumentCommand(project.Id, { files: [context.testData.createFile()] });
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.MonitoringOfficer,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(true);
  });

  test("accessControl - all other roles fail", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const command = new UploadProjectDocumentCommand(project.Id, { files: [context.testData.createFile()] });
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact | ProjectRole.ProjectManager,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
