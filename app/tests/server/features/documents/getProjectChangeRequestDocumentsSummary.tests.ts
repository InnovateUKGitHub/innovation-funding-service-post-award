// tslint:disable no-duplicate-string
import * as Entites from "@framework/entities";
import { Authorisation, ProjectRole } from "@framework/types";
import { GetProjectChangeRequestDocumentsSummaryQuery } from "@server/features/documents/getProjectChangeRequestDocumentsSummary";
import { TestContext } from "../../testContextProvider";

describe("GetProjectDocumentsSummaryQuery", () => {
  it("should return all documents associated with the project change request item", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project);
    const pcrRecordType: Entites.RecordType = {
      id: "id_1",
      parent: pcr.id,
      type: "type"
    };
    const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

    context.testData.createDocument(pcrItem.id, "PCR doc 1", "txt");
    context.testData.createDocument(pcrItem.id, "PCR doc 2", "txt");

    const query = new GetProjectChangeRequestDocumentsSummaryQuery(project.Id, pcrItem.id);
    const documents = await context.runQuery(query);
    expect(documents).toHaveLength(2);
  });

  it("should not return any documents from other project change request items", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project);
    const pcr2 = context.testData.createPCR(project);
    const pcrRecordType: Entites.RecordType = {
      id: "id_1",
      parent: pcr.id,
      type: "type"
    };
    const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);
    const pcrItem2 = context.testData.createPCRItem(pcr2, pcrRecordType);

    context.testData.createDocument(pcrItem.id, "PCR doc 1", "txt");
    context.testData.createDocument(pcrItem.id, "PCR doc 2", "txt");

    const query = new GetProjectChangeRequestDocumentsSummaryQuery(project.Id, pcrItem2.id);
    const documents = await context.runQuery(query);

    expect(documents).toHaveLength(0);
  });

  it("should return correct properties", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();

    const pcr = context.testData.createPCR(project);
    const pcrRecordType: Entites.RecordType = {
      id: "id_1",
      parent: pcr.id,
      type: "type"
    };
    const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

    const expectedFileName = "PCR1";
    const expectedExtension = "txt";
    const expectedContent = "Expected content";
    const expectedDescription = "This is a PCR";

    const document = context.testData.createDocument(pcrItem.id, expectedFileName, expectedExtension, expectedContent, expectedDescription);

    const query = new GetProjectChangeRequestDocumentsSummaryQuery(project.Id, pcrItem.id);
    const result = await context.runQuery(query).then(x => x[0]);

    expect(result.id).toBe(document.Id);
    expect(result.fileName).toBe(`${expectedFileName}.${expectedExtension}`);
    expect(result.fileSize).toBe(document.ContentSize);
    expect(result.description).toBe(document.Description);
  });

  it("should return correct URL", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project);
    const pcrRecordType: Entites.RecordType = {
      id: "id_1",
      parent: pcr.id,
      type: "type"
    };
    const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

    const document = context.testData.createDocument(pcrItem.id, "PCR doc 1", "txt");

    const query = new GetProjectChangeRequestDocumentsSummaryQuery(project.Id, pcrItem.id);
    const result = await context.runQuery(query).then(x => x[0]);

    expect(result.link).toBe(`/api/documents/projectChangeRequests/${pcrItem.id}/${document.Id}/content`);
  });

  describe("authorisation", () => {
    it("Should allow MO of project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project);
      const pcrRecordType: Entites.RecordType = {
        id: "id_1",
        parent: pcr.id,
        type: "type"
      };
      const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

      const query = new GetProjectChangeRequestDocumentsSummaryQuery(project.Id, pcrItem.id);

      const auth = new Authorisation({[project.Id]: {projectRoles: ProjectRole.MonitoringOfficer, partnerRoles: {}}});
      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    it("Should allow PM of project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project);
      const pcrRecordType: Entites.RecordType = {
        id: "id_1",
        parent: pcr.id,
        type: "type"
      };
      const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

      const query = new GetProjectChangeRequestDocumentsSummaryQuery(project.Id, pcrItem.id);

      const auth = new Authorisation({[project.Id]: {projectRoles: ProjectRole.ProjectManager, partnerRoles: {}}});
      expect(await context.runAccessControl(auth, query)).toBe(true);
    });

    it("Should not allow FC of project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project);
      const pcrRecordType: Entites.RecordType = {
        id: "id_1",
        parent: pcr.id,
        type: "type"
      };
      const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

      const query = new GetProjectChangeRequestDocumentsSummaryQuery(project.Id, pcrItem.id);

      const auth = new Authorisation({[project.Id]: {projectRoles: ProjectRole.FinancialContact, partnerRoles: {}}});
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

    it("Should not allow MO of a different project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const project2 = context.testData.createProject();
      const pcr = context.testData.createPCR(project);
      const pcrRecordType: Entites.RecordType = {
        id: "id_1",
        parent: pcr.id,
        type: "type"
      };
      const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

      const query = new GetProjectChangeRequestDocumentsSummaryQuery(project.Id, pcrItem.id);

      const auth = new Authorisation({[project2.Id]: {projectRoles: ProjectRole.MonitoringOfficer, partnerRoles: {}}});
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });

    it("Should not allow PM of a different project to run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const project2 = context.testData.createProject();
      const pcr = context.testData.createPCR(project);
      const pcrRecordType: Entites.RecordType = {
        id: "id_1",
        parent: pcr.id,
        type: "type"
      };
      const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

      const query = new GetProjectChangeRequestDocumentsSummaryQuery(project.Id, pcrItem.id);

      const auth = new Authorisation({[project2.Id]: {projectRoles: ProjectRole.ProjectManager, partnerRoles: {}}});
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });
  });
});
