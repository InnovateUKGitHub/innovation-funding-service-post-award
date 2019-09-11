// tslint:disable
import { TestContext } from "../../testContextProvider";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { PCRItemStatus, PCRStatus } from "@framework/entities";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ValidationError } from "@server/features/common";
import { Authorisation, PCRDto, ProjectRole } from "@framework/types";
import { getAllEnumValues } from "@shared/enumHelper";

describe("UpdatePCRCommand", () => {
  describe("Access control", () => {
    test("fc cannot run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.FinancialContact, partnerRoles: {} } });
      const command = new UpdatePCRCommand(project.Id, "", {} as PCRDto);
      expect(await context.runAccessControl(auth, command)).toBe(false);
    });

    test("pm can run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.ProjectManager, partnerRoles: {} } });
      const command = new UpdatePCRCommand(project.Id, "", {} as PCRDto);
      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("mo can run", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();

      const auth = new Authorisation({ [project.Id]: { projectRoles: ProjectRole.MonitoringOfficer, partnerRoles: {} } });
      const command = new UpdatePCRCommand(project.Id, "", {} as PCRDto);
      expect(await context.runAccessControl(auth, command)).toBe(true);
    });
  });

  describe("pm updates", () => {
    const validStatusChanges = [
      { from: PCRStatus.Draft, to: PCRStatus.SubmittedToMonitoringOfficer },
      { from: PCRStatus.QueriedByMonitoringOfficer, to: PCRStatus.SubmittedToMonitoringOfficer },
      { from: PCRStatus.QueriedByInnovateUK, to: PCRStatus.SubmittedToInnovationLead },
    ];

    test.each(validStatusChanges.map<[string, string, PCRStatus, PCRStatus]>(x => [PCRStatus[x.from], PCRStatus[x.to], x.from, x.to]))("can update from %s to %s", async (fromString, toString, from: PCRStatus, to: PCRStatus) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status: from });
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.status = to;

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.status).toBe(dto.status);
    });

    const validEditStatus = [
      PCRStatus.Draft,
      PCRStatus.QueriedByInnovateUK,
      PCRStatus.QueriedByMonitoringOfficer,
    ];

    test.each(validEditStatus.map<[string, PCRStatus]>(x => [PCRStatus[x], x]))("can update when %s", async (label, status) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status, reasoningStatus: PCRItemStatus.Complete, comments: "Comments", reasoning: "Reasoning" });
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.reasoningStatus = PCRItemStatus.Complete;
      dto.reasoningComments = "New reasoning comments";
      dto.comments = "New comments";

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.status).toBe(status);
      expect(pcr.reasoningStatus).toBe(PCRItemStatus.Complete);
      expect(pcr.reasoning).toBe("New reasoning comments");
      expect(pcr.comments).toBe("New comments");
    });

    const invalidEditStatus = getAllEnumValues<PCRStatus>(PCRStatus).filter(x => validEditStatus.indexOf(x) === -1);

    test.each(invalidEditStatus.map<[string, PCRStatus]>(x => [PCRStatus[x], x]))("can not update when %s", async (stausLabel, status) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status, reasoningStatus: PCRItemStatus.Complete, comments: "Comments", reasoning: "Reasoning" });
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.reasoningStatus = PCRItemStatus.Complete;
      dto.reasoningComments = "New reasoning comments";
      dto.comments = "New comments";

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });

    test("updates item status", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft, reasoningStatus: PCRItemStatus.Complete });
      const recordTypes = context.testData.range(3, x => context.testData.createRecordType({ parent: "Acc_ProjectChangeRequest__c"}));
      recordTypes[0].type = "Partner Withdrawal";
      recordTypes[1].type = "Project Suspension";
      recordTypes[2].type = "Scope Change";

      recordTypes.forEach(r => context.testData.createPCRItem(pcr, r, {status : PCRItemStatus.Incomplete}));

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      expect(dto.items.length).toBe(3);

      dto.items[1].status = PCRItemStatus.Complete;

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.items.map(x => x.status)).toEqual([PCRItemStatus.Incomplete, PCRItemStatus.Complete, PCRItemStatus.Incomplete ]);
    })
  });

  describe("mo updates", () => {
    const statusChanges = [
      { from: PCRStatus.SubmittedToMonitoringOfficer, to: PCRStatus.QueriedByMonitoringOfficer },
      { from: PCRStatus.SubmittedToMonitoringOfficer, to: PCRStatus.SubmittedToInnovationLead },
    ];

    test.each(statusChanges.map<[string, string, PCRStatus, PCRStatus]>(x => [PCRStatus[x.from], PCRStatus[x.to], x.from, x.to]))("can update from %s to %s", async (fromString, toString, from: PCRStatus, to: PCRStatus) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status: from });
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsMonitoringOfficer(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.status = to;

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.status).toBe(dto.status);
    });

    const validEditStatus = [
      PCRStatus.SubmittedToMonitoringOfficer,
    ];

    test.each(validEditStatus.map<[string, PCRStatus]>(x => [PCRStatus[x], x]))("can update when %s", async (label, status) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status, reasoningStatus: PCRItemStatus.Complete, comments: "Comments", reasoning: "Reasoning" });
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsMonitoringOfficer(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.comments = "New comments";

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.status).toBe(status);
      expect(pcr.comments).toBe("New comments");
    });

    const invalidEditStatus = getAllEnumValues<PCRStatus>(PCRStatus).filter(x => validEditStatus.indexOf(x) === -1);

    test.each(invalidEditStatus.map<[string, PCRStatus]>(x => [PCRStatus[x], x]))("can not update when %s", async (stausLabel, status) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status, reasoningStatus: PCRItemStatus.Incomplete, comments: "Comments", reasoning: "Reasoning" });

      context.testData.createCurrentUserAsMonitoringOfficer(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.comments = "New comments";

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });

  });

  test("updates pcr fields if pm", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft });
    context.testData.createPCRItem(pcr);

    context.testData.createCurrentUserAsProjectManager(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.comments = "Updated Comments";
    dto.reasoningComments = "Updated Reasoning";
    dto.reasoningStatus = PCRItemStatus.Complete;

    await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

    expect(pcr.comments).toBe(dto.comments);
    expect(pcr.reasoning).toBe(dto.reasoningComments);
    expect(pcr.reasoningStatus).toBe(dto.reasoningStatus);

  });

  test("if user is PM can update status from Draft to Submitted to MO ", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft });
    context.testData.createPCRItem(pcr);

    context.testData.createCurrentUserAsProjectManager(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = PCRStatus.SubmittedToMonitoringOfficer;

    await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

    expect(pcr.status).toBe(PCRStatus.SubmittedToMonitoringOfficer);
  });

  test("if user is MO can update status to QueriedByMonitoringOfficer ", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: PCRStatus.SubmittedToMonitoringOfficer });
    context.testData.createPCRItem(pcr);

    context.testData.createCurrentUserAsMonitoringOfficer(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = PCRStatus.QueriedByMonitoringOfficer;

    await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

    expect(pcr.status).toBe(PCRStatus.QueriedByMonitoringOfficer);
  });

  test("if user is PM cannot update status to Draft", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: PCRStatus.QueriedByMonitoringOfficer });

    context.testData.createCurrentUserAsProjectManager(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = PCRStatus.Draft;

    await expect(context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto))).rejects.toThrow(ValidationError);
  });
});
