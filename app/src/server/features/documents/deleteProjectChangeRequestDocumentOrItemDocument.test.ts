import { ProjectRolePermissionBits } from "@framework/constants/project";
import { RecordType } from "@framework/entities/recordType";
import { Authorisation } from "@framework/types/authorisation";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("DeleteProjectChangeRequestDocumentOrItemCommand", () => {
  it("should delete an item document", async () => {
    const context = new TestContext();
    const document = context.testData.createDocument(
      "3",
      "title",
      "jpg",
      "some content",
      undefined,
      undefined,
      x => (x.Acc_UploadedByMe__c = true),
    );
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);
    const recordType: RecordType = {
      id: "id_1",
      parent: projectChangeRequest.id,
      type: "Scope Change",
    };
    const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

    const deleteCommand = new DeleteProjectChangeRequestDocumentOrItemDocument(
      document.ContentDocumentId,
      project.Id,
      projectChangeRequestItem.id,
    );
    await context.runCommand(deleteCommand);
    expect(context.repositories.documents.Items).toHaveLength(0);
  });

  it("should delete a project change request document", async () => {
    const context = new TestContext();
    const document = context.testData.createDocument(
      "3",
      "title",
      "jpg",
      "some content",
      undefined,
      undefined,
      x => (x.Acc_UploadedByMe__c = true),
    );
    const project = context.testData.createProject();
    const projectChangeRequest = context.testData.createPCR(project);

    const deleteCommand = new DeleteProjectChangeRequestDocumentOrItemDocument(
      document.ContentDocumentId,
      project.Id,
      projectChangeRequest.id,
    );
    await context.runCommand(deleteCommand);
    expect(context.repositories.documents.Items).toHaveLength(0);
  });

  describe("access control", () => {
    it("project manager should run", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const projectChangeRequest = context.testData.createPCR(project);
      const recordType: RecordType = {
        id: "recordType_1",
        parent: projectChangeRequest.id,
        type: "Scope change",
      };
      const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

      const document = context.testData.createDocument("3", "title", "jpg", "some content");
      expect(context.repositories.documents.Items).toHaveLength(1);

      const command = new DeleteProjectChangeRequestDocumentOrItemDocument(
        document.ContentDocumentId,
        project.Id,
        projectChangeRequestItem.id,
      );

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.ProjectManager,
          partnerRoles: {},
        },
      });

      const result = await context.runAccessControl(auth, command);
      expect(result).toBe(true);
    });

    it("other roles should not run", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const projectChangeRequest = context.testData.createPCR(project);
      const recordType: RecordType = {
        id: "recordType_1",
        parent: projectChangeRequest.id,
        type: "Scope change",
      };
      const projectChangeRequestItem = context.testData.createPCRItem(projectChangeRequest, recordType);

      const document = context.testData.createDocument("3", "title", "jpg", "some content");
      expect(context.repositories.documents.Items).toHaveLength(1);

      const command = new DeleteProjectChangeRequestDocumentOrItemDocument(
        document.ContentDocumentId,
        project.Id,
        projectChangeRequestItem.id,
      );

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.MonitoringOfficer | ProjectRolePermissionBits.FinancialContact,
          partnerRoles: {},
        },
      });

      const result = await context.runAccessControl(auth, command);
      expect(result).toBe(false);
    });
  });
});
