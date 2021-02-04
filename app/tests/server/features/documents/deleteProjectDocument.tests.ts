import { Authorisation, ProjectRole } from "@framework/types";
import { DeleteProjectDocumentCommand } from "@server/features/documents/deleteProjectDocument";
import { TestContext } from "../../testContextProvider";

describe("DeleteProjectDocumentCommand()", () => {
  it("should delete item when run", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const document = context.testData.createDocument("40", "Document title", "txt", "hello");
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
          projectRoles: ProjectRole.MonitoringOfficer,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, deleteDocumentCommand)).toBe(true);
    });

    test("when set to Finance Contact", async () => {
      const { deleteDocumentCommand, project, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, deleteDocumentCommand)).toBe(false);
    });

    test("when set to Project Manager", async () => {
      const { deleteDocumentCommand, project, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.ProjectManager,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, deleteDocumentCommand)).toBe(false);
    });

    test("when set to Unknown", async () => {
      const { deleteDocumentCommand, project, context } = setupAccessControlContext();

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.Unknown,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, deleteDocumentCommand)).toBe(false);
    });
  });
});
