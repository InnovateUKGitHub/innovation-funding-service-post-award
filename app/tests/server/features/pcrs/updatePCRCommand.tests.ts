// tslint:disable
import { TestContext } from "../../testContextProvider";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStatus } from "@framework/entities";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ValidationError } from "@server/features/common";
import { Authorisation, PCRDto, PCRItemDto, ProjectRole } from "@framework/types";
import { getAllEnumValues } from "@shared/enumHelper";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";

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
      { from: ProjectChangeRequestStatus.Draft, to: ProjectChangeRequestStatus.SubmittedToMonitoringOfficer },
      { from: ProjectChangeRequestStatus.QueriedByMonitoringOfficer, to: ProjectChangeRequestStatus.SubmittedToMonitoringOfficer },
      { from: ProjectChangeRequestStatus.QueriedByInnovateUK, to: ProjectChangeRequestStatus.SubmittedToInnovationLead },
    ];

    test.each(validStatusChanges.map<[string, string, ProjectChangeRequestStatus, ProjectChangeRequestStatus]>(x => [ProjectChangeRequestStatus[x.from], ProjectChangeRequestStatus[x.to], x.from, x.to]))("can update from %s to %s", async (fromString, toString, from: ProjectChangeRequestStatus, to: ProjectChangeRequestStatus) => {
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
      ProjectChangeRequestStatus.Draft,
      ProjectChangeRequestStatus.QueriedByInnovateUK,
      ProjectChangeRequestStatus.QueriedByMonitoringOfficer,
    ];

    test.each(validEditStatus.map<[string, ProjectChangeRequestStatus]>(x => [ProjectChangeRequestStatus[x], x]))("can update when %s", async (label, status) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status, reasoningStatus: ProjectChangeRequestItemStatus.Complete, comments: "Comments", reasoning: "Reasoning" });
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.reasoningStatus = ProjectChangeRequestItemStatus.Complete;
      dto.reasoningComments = "New reasoning comments";
      dto.comments = "New comments";

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.status).toBe(status);
      expect(pcr.reasoningStatus).toBe(ProjectChangeRequestItemStatus.Complete);
      expect(pcr.reasoning).toBe("New reasoning comments");
      expect(pcr.comments).toBe("New comments");
    });

    const invalidEditStatus = getAllEnumValues<ProjectChangeRequestStatus>(ProjectChangeRequestStatus).filter(x => validEditStatus.indexOf(x) === -1);

    test.each(invalidEditStatus.map<[string, ProjectChangeRequestStatus]>(x => [ProjectChangeRequestStatus[x], x]))("can not update when %s", async (stausLabel, status) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status, reasoningStatus: ProjectChangeRequestItemStatus.Complete, comments: "Comments", reasoning: "Reasoning" });
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.reasoningStatus = ProjectChangeRequestItemStatus.Complete;
      dto.reasoningComments = "New reasoning comments";
      dto.comments = "New comments";

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });

    test("reasonsing comments are required when reasoning status is complete", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

      dto.reasoningComments = ""
      dto.reasoningStatus = ProjectChangeRequestItemStatus.Complete;

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, dto))).rejects.toThrow(ValidationError);

      dto.reasoningComments = "Test Comments"

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, dto))).resolves.toBe(true);
    });

    test("updates item status", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status: ProjectChangeRequestStatus.Draft, reasoningStatus: ProjectChangeRequestItemStatus.Complete });
      const recordTypes = context.testData.range(3, x => context.testData.createRecordType({ parent: "Acc_ProjectChangeRequest__c"}));
      recordTypes[0].type = "Remove a partner";
      recordTypes[1].type = "Put project on hold";
      recordTypes[2].type = "Change project scope";

      recordTypes.forEach(r => context.testData.createPCRItem(pcr, r, {status : ProjectChangeRequestItemStatus.Incomplete}));

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      expect(dto.items.length).toBe(3);

      dto.items[1].status = ProjectChangeRequestItemStatus.Complete;

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.items.map(x => x.status)).toEqual([ProjectChangeRequestItemStatus.Incomplete, ProjectChangeRequestItemStatus.Complete, ProjectChangeRequestItemStatus.Incomplete ]);
    });

    test("adds items", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createPartner(project);
      const pcr = context.testData.createPCR(project, { status: ProjectChangeRequestStatus.Draft, reasoningStatus: ProjectChangeRequestItemStatus.Complete });
      const recordTypes = context.testData.range(3, x => context.testData.createRecordType({ parent: "Acc_ProjectChangeRequest__c"}));
      recordTypes[0].type = "Remove a partner";
      recordTypes[1].type = "Put project on hold";
      recordTypes[2].type = "Change project scope";

      context.testData.createPCRItem(pcr, recordTypes[0], {status : ProjectChangeRequestItemStatus.Incomplete});
      context.testData.createPCRItem(pcr, recordTypes[1], {status : ProjectChangeRequestItemStatus.Incomplete});

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      expect(dto.items.length).toBe(2);

      dto.items.push({
        status: ProjectChangeRequestItemStatus.ToDo,
        type: PCRRecordTypeMetaValues.find(x => x.typeName === recordTypes[2].type)!.type,
      } as PCRItemDto);

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.items.length).toBe(3);
    })

    it("does not allow duplicate item types", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createPartner(project);
      const pcr = context.testData.createPCR(project, { status: ProjectChangeRequestStatus.Draft, reasoningStatus: ProjectChangeRequestItemStatus.Complete });
      const recordTypes = context.testData.range(3, x => context.testData.createRecordType({ parent: "Acc_ProjectChangeRequest__c"}));
      recordTypes[0].type = "Remove a partner";
      recordTypes[1].type = "Put project on hold";

      context.testData.createPCRItem(pcr, recordTypes[0], {status : ProjectChangeRequestItemStatus.Incomplete});
      context.testData.createPCRItem(pcr, recordTypes[1], {status : ProjectChangeRequestItemStatus.Incomplete});

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      expect(dto.items.length).toBe(2);

      dto.items.push({
        status: ProjectChangeRequestItemStatus.ToDo,
        type: recordTypes[2].type as any as ProjectChangeRequestItemTypeEntity
      } as PCRItemDto);

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    })
  });

  describe("mo updates", () => {
    const statusChanges = [
      { from: ProjectChangeRequestStatus.SubmittedToMonitoringOfficer, to: ProjectChangeRequestStatus.QueriedByMonitoringOfficer },
      { from: ProjectChangeRequestStatus.SubmittedToMonitoringOfficer, to: ProjectChangeRequestStatus.SubmittedToInnovationLead },
    ];

    test.each(statusChanges.map<[string, string, ProjectChangeRequestStatus, ProjectChangeRequestStatus]>(x => [ProjectChangeRequestStatus[x.from], ProjectChangeRequestStatus[x.to], x.from, x.to]))("can update from %s to %s", async (fromString, toString, from: ProjectChangeRequestStatus, to: ProjectChangeRequestStatus) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status: from });
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsMonitoringOfficer(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.status = to;
      dto.comments = "Some comments";

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.status).toBe(dto.status);
    });

    const validEditStatus = [
      ProjectChangeRequestStatus.SubmittedToMonitoringOfficer,
    ];

    test.each(validEditStatus.map<[string, ProjectChangeRequestStatus]>(x => [ProjectChangeRequestStatus[x], x]))("can update when %s", async (label, status) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status, reasoningStatus: ProjectChangeRequestItemStatus.Complete, comments: "Comments", reasoning: "Reasoning" });
      context.testData.createPCRItem(pcr);

      context.testData.createCurrentUserAsMonitoringOfficer(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.comments = "New comments";

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.status).toBe(status);
      expect(pcr.comments).toBe("New comments");
    });

    const invalidEditStatus = getAllEnumValues<ProjectChangeRequestStatus>(ProjectChangeRequestStatus).filter(x => validEditStatus.indexOf(x) === -1);

    test.each(invalidEditStatus.map<[string, ProjectChangeRequestStatus]>(x => [ProjectChangeRequestStatus[x], x]))("can not update when %s", async (stausLabel, status) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status, reasoningStatus: ProjectChangeRequestItemStatus.Incomplete, comments: "Comments", reasoning: "Reasoning" });

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
    const pcr = context.testData.createPCR(project, { status: ProjectChangeRequestStatus.Draft });
    context.testData.createPCRItem(pcr);

    context.testData.createCurrentUserAsProjectManager(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.comments = "Updated Comments";
    dto.reasoningComments = "Updated Reasoning";
    dto.reasoningStatus = ProjectChangeRequestItemStatus.Complete;

    await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

    expect(pcr.comments).toBe(dto.comments);
    expect(pcr.reasoning).toBe(dto.reasoningComments);
    expect(pcr.reasoningStatus).toBe(dto.reasoningStatus);

  });

  test("if user is PM can update status from Draft to Submitted to MO ", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: ProjectChangeRequestStatus.Draft });
    context.testData.createPCRItem(pcr);

    context.testData.createCurrentUserAsProjectManager(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = ProjectChangeRequestStatus.SubmittedToMonitoringOfficer;

    await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

    expect(pcr.status).toBe(ProjectChangeRequestStatus.SubmittedToMonitoringOfficer);
  });

  test("if user is PM can update status from Quried by Innovate to Submitted to Innovate", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: ProjectChangeRequestStatus.QueriedByInnovateUK });
    context.testData.createPCRItem(pcr);

    context.testData.createCurrentUserAsProjectManager(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = ProjectChangeRequestStatus.SubmittedToInnovationLead;

    await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

    expect(pcr.status).toBe(ProjectChangeRequestStatus.SubmittedToInnovationLead);
  });

  test("if user is MO can update status to QueriedByMonitoringOfficer ", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: ProjectChangeRequestStatus.SubmittedToMonitoringOfficer });
    context.testData.createPCRItem(pcr);

    context.testData.createCurrentUserAsMonitoringOfficer(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = ProjectChangeRequestStatus.QueriedByMonitoringOfficer;
    dto.comments = "Test Comments"

    await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

    expect(pcr.status).toBe(ProjectChangeRequestStatus.QueriedByMonitoringOfficer);
  });

  test("if user is PM cannot update status to Draft", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: ProjectChangeRequestStatus.QueriedByMonitoringOfficer });

    context.testData.createCurrentUserAsProjectManager(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = ProjectChangeRequestStatus.Draft;

    await expect(context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto))).rejects.toThrow(ValidationError);
  });
});
