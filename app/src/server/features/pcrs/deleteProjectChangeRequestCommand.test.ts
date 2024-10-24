import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { BadRequestError, NotFoundError } from "@shared/appError";
import { getAllNumericalEnumValues } from "@shared/enumHelper";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("DeleteProjectChangeRequestCommand", () => {
  describe("authorisation", () => {
    test("Project Manager can run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project);

      const command = new DeleteProjectChangeRequestCommand(project.Id, pcr.id);

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.ProjectManager,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("Other Roles cannot run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project);

      const command = new DeleteProjectChangeRequestCommand(project.Id, pcr.id);

      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRolePermissionBits.FinancialContact | ProjectRolePermissionBits.MonitoringOfficer,
          partnerRoles: {},
        },
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });

  test("should throw error if pcr not found", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();

    const command = new DeleteProjectChangeRequestCommand(project.Id, "----" as PcrId);

    await expect(context.runCommand(command)).rejects.toThrow(NotFoundError);
  });

  test("should throw error if pcr for different project", async () => {
    const context = new TestContext();

    const project1 = context.testData.createProject();
    const project2 = context.testData.createProject();
    const pcr = context.testData.createPCR(project1);

    const command = new DeleteProjectChangeRequestCommand(project2.Id, pcr.id);

    await expect(context.runCommand(command)).rejects.toThrow(NotFoundError);
  });

  test("should delete pcr if valid request", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: PCRStatus.DraftWithProjectManager });

    const command = new DeleteProjectChangeRequestCommand(project.Id, pcr.id);

    expect(context.repositories.projectChangeRequests.Items.length).toBe(1);

    await context.runCommand(command);

    expect(context.repositories.projectChangeRequests.Items.length).toBe(0);
  });

  const draftItemsToExclude = [PCRStatus.DraftWithProjectManager, PCRStatus.Unknown];
  const filteredPcrStates = getAllNumericalEnumValues(PCRStatus).filter(x => !draftItemsToExclude.includes(x));

  filteredPcrStates.forEach(status => {
    test(`cannot delete pcr in ${PCRStatus[status]} status`, async () => {
      const context = new TestContext();
      const pcr = context.testData.createPCR(undefined, { status });

      const command = new DeleteProjectChangeRequestCommand(pcr.projectId, pcr.id);

      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });
  });
});
