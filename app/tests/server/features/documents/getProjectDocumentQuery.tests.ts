import { TestContext } from "../../testContextProvider";
import { GetProjectDocumentQuery } from "@server/features/documents/getProjectDocument";
import { Authorisation, ProjectRole } from "@framework/types";

describe("GetProjectDocumentQuery", () => {
  it("should return result if document exists", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const document = context.testData.createDocument(project.Id, "cat", "jpg", "Cher", "file content");

    const query = new GetProjectDocumentQuery(project.Id, document.Id);
    const result = await context.runQuery(query).then(x => x!);

    expect(result).not.toBeNull();
    expect(result.fileName).toBe("cat.jpg");
    expect(result.fileType).toBe("jpg");
    expect(result.contentLength).toBe("file content".length);
    expect(result.stream).not.toBeNull();
  });

  it("should return null if document dosnt exist", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const query = new GetProjectDocumentQuery(project.Id, "FAKE ID");
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  it("should return null if document belongs to another project", async () => {
    const context = new TestContext();
    const project1 = context.testData.createProject();
    const project2 = context.testData.createProject();

    const document = context.testData.createDocument(project2.Id);

    const query = new GetProjectDocumentQuery(project1.Id, document.Id);
    const result = await context.runQuery(query);

    expect(result).toBe(null);
  });

  describe("authorisation", () => {
    it("should allow MO of project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const document = context.testData.createDocument(project.Id);

      const query = new GetProjectDocumentQuery(project.Id, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.MonitoringOfficer, partnerRoles: {} } });
      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    it("should not allow PM of project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const document = context.testData.createDocument(project.Id);

      const query = new GetProjectDocumentQuery(project.Id, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.ProjectManager, partnerRoles: {} } });
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

    it("should not allow FC of project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const document = context.testData.createDocument(project.Id);

      const query = new GetProjectDocumentQuery(project.Id, document.Id);

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.FinancialContact, partnerRoles: {} } });
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

    it("should not allow MO of another project to run", async () => {
      const context = new TestContext();

      const project1 = context.testData.createProject();
      const project2 = context.testData.createProject();
      const document = context.testData.createDocument(project1.Id);

      const query = new GetProjectDocumentQuery(project1.Id, document.Id);

      const auth = new Authorisation({ [project2.Id]: { projectRoles: ProjectRole.MonitoringOfficer, partnerRoles: {} } });
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });
  });
});
