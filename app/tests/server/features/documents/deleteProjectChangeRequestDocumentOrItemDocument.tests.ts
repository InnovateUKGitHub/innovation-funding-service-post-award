// tslint:disable: no-duplicate-string
import * as Entites from "@framework/entities";
import { Authorisation, ProjectRole } from "@framework/types";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { TestContext } from "../../testContextProvider";

describe("DeleteProjectChangeRequestDocumentOrItemCommand", () => {
  it("should delete an item document", async () => {
    const context = new TestContext();
    const document = context.testData.createDocument("3", "title", "jpg", "some content");
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: Entites.RecordType = {
      id: "id_1",
      parent: projectChangeRequest.id,
      type: "Scope Change"
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const deleteCommand = new DeleteProjectChangeRequestDocumentOrItemDocument(document.ContentDocumentId, project.Id, projectChangeRequestItem.id);
    await context.runCommand(deleteCommand);
    expect(context.repositories.documents.Items).toHaveLength(0);
  });

  it("should delete a project change request document", async () => {
    const context = new TestContext();
    const document = context.testData.createDocument("3", "title", "jpg", "some content");
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);

    const deleteCommand = new DeleteProjectChangeRequestDocumentOrItemDocument(document.ContentDocumentId, project.Id, projectChangeRequest.id);
    await context.runCommand(deleteCommand);
    expect(context.repositories.documents.Items).toHaveLength(0);
  });

  describe("access control", () => {
    it("project manager should run", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const projectChangeRequest = context.testData.createPCR(project);
      const recordType: Entites.RecordType = {
        id: "recordType_1",
        parent: projectChangeRequest.id,
        type: "Scope change"
      };
      const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

      const document = context.testData.createDocument("3", "title", "jpg", "some content");
      expect(context.repositories.documents.Items).toHaveLength(1);

      const command = new DeleteProjectChangeRequestDocumentOrItemDocument(document.ContentDocumentId, project.Id, projectChangeRequestItem.id);

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.ProjectManager,
          partnerRoles: {}
        }
      });

      const result = await context.runAccessControl(auth, command);
      expect(result).toBe(true);
    });

    it("other roles should not run", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const projectChangeRequest = context.testData.createPCR(project);
      const recordType: Entites.RecordType = {
        id: "recordType_1",
        parent: projectChangeRequest.id,
        type: "Scope change"
      };
      const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

      const document = context.testData.createDocument("3", "title", "jpg", "some content");
      expect(context.repositories.documents.Items).toHaveLength(1);

      const command = new DeleteProjectChangeRequestDocumentOrItemDocument(document.ContentDocumentId, project.Id, projectChangeRequestItem.id);

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.MonitoringOfficer | ProjectRole.FinancialContact,
          partnerRoles: {}
        }
      });

      const result = await context.runAccessControl(auth, command);
      expect(result).toBe(false);
    });
  });
});
