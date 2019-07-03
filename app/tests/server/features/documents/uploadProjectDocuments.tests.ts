import { TestContext } from "../../testContextProvider";
import { UploadProjectDocumentCommand } from "@server/features/documents/uploadProjectDocument";
import { ValidationError } from "@server/features/common/appError";
import { Authorisation, ProjectRole } from "@framework/types";

describe("UploadProjectDocumentCommand", () => {
  it("should upload a project document", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const content = "Some content";
    const fileName = "test.csv";

    const file = context.testData.createFile(content, fileName);

    const command = new UploadProjectDocumentCommand(project.Id, {file});
    const documentId = await context.runCommand(command);
    const document = await context.repositories.documents.getDocumentMetadata(documentId);

    expect(document.VersionData).toEqual(content);
    expect(document.PathOnClient).toEqual(fileName);
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

  test("accessControl - Project Monitoring officer passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const command = new UploadProjectDocumentCommand(project.Id, {} as any);
    const auth    = new Authorisation({
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
    const command = new UploadProjectDocumentCommand(project.Id, {} as any);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact | ProjectRole.ProjectManager,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
