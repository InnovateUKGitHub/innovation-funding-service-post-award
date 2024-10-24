import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { DeleteProjectDocumentCommand } from "@server/features/documents/deleteProjectDocument";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("DeleteProjectDocumentCommand()", () => {
  it("should delete item when run", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const document = context.testData.createDocument(
      "40",
      "Document title",
      "txt",
      "hello",
      undefined,
      undefined,
      x => (x.Acc_UploadedByMe__c = true),
    );
    expect(context.repositories.documents.Items).toHaveLength(1);

    const deleteDocumentCommand = new DeleteProjectDocumentCommand(project.Id, document.Id);
    await context.runCommand(deleteDocumentCommand);
    expect(context.repositories.documents.Items).toHaveLength(0);
  });

  describe("with access control can delete the document", () => {
    const setupAccessControlContext = () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const monitoringOfficer = context.testData.createMonitoringOfficer(project);
      const document = context.testData.createDocument(
        "40",
        "Document title",
        "txt",
        monitoringOfficer.Id,
        "content",
        "Review meeting",
      );
      expect(context.repositories.documents.Items).toHaveLength(1);

      const deleteDocumentCommand = new DeleteProjectDocumentCommand(project.Id, document.Id);

      return { deleteDocumentCommand, project, context };
    };

    test("when set to Monitoring Officer", async () => {
      const { deleteDocumentCommand, project, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.MonitoringOfficer,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, deleteDocumentCommand)).toBe(true);
    });

    test("when set to Finance Contact", async () => {
      const { deleteDocumentCommand, project, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.FinancialContact,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, deleteDocumentCommand)).toBe(false);
    });

    test("when set to Project Manager", async () => {
      const { deleteDocumentCommand, project, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.ProjectManager,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, deleteDocumentCommand)).toBe(false);
    });

    test("when set to Unknown", async () => {
      const { deleteDocumentCommand, project, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.Unknown,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, deleteDocumentCommand)).toBe(false);
    });
  });
});
