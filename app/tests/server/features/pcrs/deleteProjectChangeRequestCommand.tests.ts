import { TestContext } from "../../testContextProvider";
import { Authorisation, ProjectRole } from "@framework/types";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { BadRequestError, NotFoundError } from "@server/features/common";
import { ProjectChangeRequestStatus } from "@framework/entities";
import { getAllEnumValues } from "@shared/enumHelper";

describe("DeleteProjectChangeRequestCommand", () => {
  describe("authorisation", () => {
    test("Project Manager can run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project);

      const command = new DeleteProjectChangeRequestCommand(project.Id, pcr.id);

      const auth    = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.ProjectManager,
          partnerRoles: {}
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("Other Roles cannot run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project);

      const command = new DeleteProjectChangeRequestCommand(project.Id, pcr.id);

      const auth    = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer,
          partnerRoles: {}
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });

  it("should throw error if pcr not found", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();

    const command = new DeleteProjectChangeRequestCommand(project.Id, "----");

    await expect(context.runCommand(command)).rejects.toThrow(NotFoundError);
  });

  it("should throw error if pcr for different project", async () => {
    const context = new TestContext();

    const project1 = context.testData.createProject();
    const project2 = context.testData.createProject();
    const pcr = context.testData.createPCR(project1);

    const command = new DeleteProjectChangeRequestCommand(project2.Id, pcr.id);

    await expect(context.runCommand(command)).rejects.toThrow(NotFoundError);
  });

  it("should delete pcr if valid request", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});

    const command = new DeleteProjectChangeRequestCommand(project.Id, pcr.id);

    expect(context.repositories.projectChangeRequests.Items.length).toBe(1);

    await context.runCommand(command);

    expect(context.repositories.projectChangeRequests.Items.length).toBe(0);
  });

  const allStatusNotDraft = getAllEnumValues<ProjectChangeRequestStatus>(ProjectChangeRequestStatus).filter(x => x !== ProjectChangeRequestStatus.Draft && x !== ProjectChangeRequestStatus.Unknown);

  it.each(allStatusNotDraft.map(x => [ProjectChangeRequestStatus[x], x]))("cannot delete pcr in %s status", async (statusName: string, status: ProjectChangeRequestStatus) => {
    const context = new TestContext();
    const pcr = context.testData.createPCR(undefined, {status});

    const command = new DeleteProjectChangeRequestCommand(pcr.projectId, pcr.id);

    await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
  });

});
