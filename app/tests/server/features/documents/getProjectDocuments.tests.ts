import { TestContext } from "../../testContextProvider";
import { GetProjectDocumentsQuery } from "@server/features/documents/getProjectDocuments";
import { Authorisation, ProjectRole } from "@framework/types";

describe("GetProjectDocumentsQuery", () => {
  it("should return all documents associated with the project", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const contentVersion1 = context.testData.createContentVersion(project.Id, "report1", "pdf");
    context.testData.createContentDocumentLink(contentVersion1.ContentDocumentId, project.Id);

    const contentVersion2 = context.testData.createContentVersion(project.Id, "report2", "pdf");
    context.testData.createContentDocumentLink(contentVersion2.ContentDocumentId, project.Id);

    const query = new GetProjectDocumentsQuery(project.Id);
    const docs = await context.runQuery(query);
    expect(docs).toHaveLength(2);
  });

  test("accessControl - Project Monitoring officer passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const command = new GetProjectDocumentsQuery(project.Id);
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
    const command = new GetProjectDocumentsQuery(project.Id);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact | ProjectRole.ProjectManager,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
