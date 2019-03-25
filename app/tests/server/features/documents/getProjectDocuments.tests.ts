import { TestContext } from "../../testContextProvider";
import { GetProjectDocumentsQuery } from "../../../../src/server/features/documents/getProjectDocuments";

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
});
