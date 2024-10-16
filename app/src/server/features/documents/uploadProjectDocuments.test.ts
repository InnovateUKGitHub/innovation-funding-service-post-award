import { UploadProjectDocumentCommand } from "@server/features/documents/uploadProjectDocument";
import { ValidationError } from "@server/features/common/appError";
import { TestContext } from "@tests/test-utils/testContextProvider";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";

describe("UploadProjectDocumentCommand", () => {
  it("should upload a project document", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const content = "Some content 1";
    const fileName = "test.csv";

    const file = context.testData.createFile(content, fileName);

    const command = new UploadProjectDocumentCommand(project.Id, { files: [file] });
    const documentIds = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentIds[0]);

    expect(document.versionData).toEqual(content);
    expect(document.pathOnClient).toEqual(fileName);
  });

  it("should throw a validation error if the file type is not allowed", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const content = "Some content";
    const fileName = "test.zip";

    const file = context.testData.createFile(content, fileName);

    const command = new UploadProjectDocumentCommand(project.Id, { files: [file] });
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should upload a project document description", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const expectedDescription = DocumentDescription.ClaimValidationForm;

    const file = context.testData.createFile();

    const command = new UploadProjectDocumentCommand(project.Id, { files: [file], description: expectedDescription });
    const documentIds = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentIds[0]);

    expect(document.description).toEqual(expectedDescription);
  });

  it("should upload muliple documents", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const files = context.testData.range(3, i => context.testData.createFile(`File ${i}`, `test${i}.txt`));
    const expectedDescription = DocumentDescription.ClaimValidationForm;

    const command = new UploadProjectDocumentCommand(project.Id, { files, description: expectedDescription });
    const documentIds = await context.runCommand(command);
    expect(documentIds.length).toBe(3);

    const documents = await Promise.all(documentIds.map(x => context.repositories.documents.getDocumentMetadata(x)));
    expect(documents.map(x => x.versionData)).toEqual(files.map(f => f.content));
    expect(documents.map(x => x.pathOnClient)).toEqual(files.map(f => f.fileName));
    expect(documents.map(x => x.description)).toEqual(files.map(() => expectedDescription));
  });

  it("should upload throw validation error if file has no content", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const files = context.testData.range(3, i => context.testData.createFile(`File ${i}`, `test${i}.txt`));

    // @ts-expect-error invalid file content
    files[1].content = null;

    const command = new UploadProjectDocumentCommand(project.Id, { files });

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should upload throw validation error if content to large", async () => {
    const context = new TestContext();
    context.config.options.maxFileSize = 10;
    const project = context.testData.createProject();

    const content = context.testData.range(context.config.options.maxFileSize + 1, () => "a").join("");

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

    expect(document.versionData).toEqual(content);
    expect(document.pathOnClient).toEqual(fileName);
  });

  it("should throw valdiation error if too many documents", async () => {
    const context = new TestContext();
    context.config.options.maxUploadFileCount = 3;

    const project = context.testData.createProject();

    const files = context.testData.range(context.config.options.maxUploadFileCount + 1, () =>
      context.testData.createFile(),
    );

    const command = new UploadProjectDocumentCommand(project.Id, { files });
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should throw a validation exception if no files", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const command = new UploadProjectDocumentCommand(project.Id, { files: [] });
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should use permitted extensions", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const file = context.testData.createFile();
    file.fileName = "text.jpeg";

    const command = new UploadProjectDocumentCommand(project.Id, { files: [file] });

    context.config.options.permittedTypes.imageTypes = ["gif"];
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);

    context.config.options.permittedTypes.imageTypes = ["jpeg"];
    await expect(context.runCommand(command)).resolves.not.toBeNull();
  });

  test("accessControl - Project Monitoring officer passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const command = new UploadProjectDocumentCommand(project.Id, { files: [context.testData.createFile()] });
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRolePermissionBits.MonitoringOfficer,
        partnerRoles: {},
      },
    });

    expect(await context.runAccessControl(auth, command)).toBe(true);
  });

  test("accessControl - all other roles fail", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const command = new UploadProjectDocumentCommand(project.Id, { files: [context.testData.createFile()] });
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRolePermissionBits.FinancialContact | ProjectRolePermissionBits.ProjectManager,
        partnerRoles: {},
      },
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
