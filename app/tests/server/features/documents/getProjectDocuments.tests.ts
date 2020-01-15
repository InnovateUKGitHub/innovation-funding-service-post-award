import { TestContext } from "../../testContextProvider";
import { GetProjectDocumentsQuery } from "@server/features/documents/getProjectDocumentsSummary";
import { Authorisation, ProjectRole } from "@framework/types";
import { DateTime } from "luxon";

describe("GetProjectDocumentsQuery", () => {
  it("should return all documents associated with the project", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    context.testData.createDocument(project.Id, "report1", "pdf");
    context.testData.createDocument(project.Id, "report2", "pdf");

    const query = new GetProjectDocumentsQuery(project.Id);
    const docs = await context.runQuery(query);
    expect(docs).toHaveLength(2);
  });

  it("should not return all documents associated with other projects", async () => {
    const context = new TestContext();
    const project1 = context.testData.createProject();
    const project2 = context.testData.createProject();

    context.testData.createDocument(project1.Id, "report1", "pdf");
    context.testData.createDocument(project1.Id, "report2", "pdf");

    const query = new GetProjectDocumentsQuery(project2.Id);
    const docs = await context.runQuery(query);
    expect(docs).toHaveLength(0);
  });

  it("should return corect properties", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const expectedFileName = "report1";
    const expectedExtention = "pdf";
    const expectedDescription = "Expected Description";
    const expectedUploadedBy = "Chaka Khan";

    const document = context.testData.createDocument(project.Id, expectedFileName, expectedExtention, expectedUploadedBy);
    document.Description = expectedDescription;

    const query = new GetProjectDocumentsQuery(project.Id);
    const result = await context.runQuery(query).then(x => x[0]);

    expect(result.id).toBe(document.Id);
    expect(result.fileName).toBe(`${expectedFileName}.${expectedExtention}`);
    expect(result.fileSize).toBe(document.ContentSize);
    expect(result.uploadedBy).toBe(document.Acc_LastModifiedByAlias__c);
    expect(result.description).toBe(document.Description);
  });

  it("should sort document in descending date order", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const documents = context.testData.range(3, i => {
      return context.testData.createDocument(project.Id, undefined, undefined, undefined,undefined, undefined, x => {
        x.CreatedDate = DateTime.local().minus({ days: 1 }).plus({ hours: i }).toISO();
      });
    });

    const query = new GetProjectDocumentsQuery(project.Id);
    const result = await context.runQuery(query);

    const expected = documents.map(x => x.Id).reverse();
    expect(result.map(x => x.id)).toEqual(expected);
  });

  it("should return corect url", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const document = context.testData.createDocument(project.Id, "report1", "pdf");

    const query = new GetProjectDocumentsQuery(project.Id);
    const result = await context.runQuery(query).then(x => x[0]);

    expect(result.link).toBe(`/api/documents/projects/${project.Id}/${document.Id}/content`);
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
