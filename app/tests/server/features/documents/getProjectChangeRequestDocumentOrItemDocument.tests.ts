// tslint:disable no-duplicate-string
import * as Entites from "@framework/entities";
import { Authorisation, ProjectRole } from "@framework/types";
import { GetProjectChangeRequestDocumentOrItemDocumentQuery } from "@server/features/documents/getProjectChangeRequestDocumentOrItemDocument";
import { TestContext } from "../../testContextProvider";

describe("GetProjectChangeRequestDocumentOrItemDocumentQuery", () => {
  it("should return result if item document exists", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project);
    const pcrRecordType: Entites.RecordType = {
      id: "id_1",
      parent: pcr.id,
      type: "type"
    };
    const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

    const document = context.testData.createDocument(pcrItem.id, "PCR Document", "txt", "Jackie", "Why I want more money");

    const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(project.Id, pcrItem.id, document.Id);
    const result = await context.runQuery(query).then(x => x!);

    expect(result).not.toBeNull();
    expect(result.fileName).toBe("PCR Document.txt");
    expect(result.contentLength).toBe("Why I want more money".length);
    expect(result.stream).not.toBeNull();
  });

  it("should return result if project change request document exists", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project);

    const document = context.testData.createDocument(pcr.id, "PCR Document", "txt", "Paul","Why I want more money");

    const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(project.Id, pcr.id, document.Id);
    const result = await context.runQuery(query).then(x => x!);

    expect(result).not.toBeNull();
    expect(result.fileName).toBe("PCR Document.txt");
    expect(result.fileType).toBe("txt");
    expect(result.contentLength).toBe("Why I want more money".length);
    expect(result.stream).not.toBeNull();
  });

  it("should return null if the document doesn't exist", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project);
    const pcrRecordType: Entites.RecordType = {
      id: "id_1",
      parent: pcr.id,
      type: "type"
    };
    const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);

    const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(project.Id, pcrItem.id, "Pretend ID");
    const result = await context.runQuery(query).then(x => x!);

    expect(result).toBe(null);
  });

  it("should return null if document belongs to another PCR item", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project);
    const pcrRecordType: Entites.RecordType = {
      id: "id_1",
      parent: pcr.id,
      type: "type"
    };
    const pcrItem = context.testData.createPCRItem(pcr, pcrRecordType);
    const pcrItem2 = context.testData.createPCRItem(pcr, pcrRecordType);

    const document = context.testData.createDocument(pcrItem.id, "PCR Document", "txt", "Why I want more managers");

    const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(project.Id, pcrItem2.id, document.Id);
    const result = await context.runQuery(query).then(x => x!);

    expect(result).toBe(null);
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

      const document = context.testData.createDocument(pcrItem.id, "PCR Document", "txt", "Why I want more projects");

      const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(project.Id, pcrItem.id, document.Id);

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

      const document = context.testData.createDocument(pcrItem.id, "PCR Document", "txt", "Why I want more projects");

      const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(project.Id, pcrItem.id, document.Id);

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

      const document = context.testData.createDocument(pcrItem.id, "PCR Document", "txt", "Why I want more projects");

      const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(project.Id, pcrItem.id, document.Id);

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

      const document = context.testData.createDocument(pcrItem.id, "PCR Document", "txt", "Why I want more projects");

      const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(project.Id, pcrItem.id, document.Id);

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

      const document = context.testData.createDocument(pcrItem.id, "PCR Document", "txt", "Why I want more projects");

      const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(project.Id, pcrItem.id, document.Id);

      const auth = new Authorisation({[project2.Id]: {projectRoles: ProjectRole.ProjectManager, partnerRoles: {}}});
      expect(await context.runAccessControl(auth, query)).toBe(false);
    });
  });
});
