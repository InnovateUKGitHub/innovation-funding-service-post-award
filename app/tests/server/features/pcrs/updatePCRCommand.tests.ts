// tslint:disable
import { DateTime } from "luxon";
import { TestContext } from "../../testContextProvider";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import * as Entites from "@framework/entities";
import {
  ProjectChangeRequestItemStatus,
  ProjectChangeRequestItemTypeEntity,
  ProjectChangeRequestStatus
} from "@framework/entities";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ValidationError } from "@server/features/common";
import {
  Authorisation,
  PCRDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRStandardItemDto,
  ProjectRole
} from "@framework/types";
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
      recordTypes[1].type = "Add a partner";
      recordTypes[2].type = "Change project scope";

      recordTypes.forEach(r => context.testData.createPCRItem(pcr, r, {status : ProjectChangeRequestItemStatus.Incomplete}));

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      expect(dto.items.length).toBe(3);

      dto.items[1].status = ProjectChangeRequestItemStatus.Complete;

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.items.map(x => x.status).sort()).toEqual([ProjectChangeRequestItemStatus.Incomplete, ProjectChangeRequestItemStatus.Complete, ProjectChangeRequestItemStatus.Incomplete ].sort());
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
      } as PCRStandardItemDto);

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.items.length).toBe(3);
    })

    it("does not allow duplicate item types", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createPartner(project);
      const pcr = context.testData.createPCR(project, { status: ProjectChangeRequestStatus.Draft, reasoningStatus: ProjectChangeRequestItemStatus.Complete });
      const recordTypes = context.testData.createPCRRecordTypes();

      context.testData.createPCRItem(pcr, recordTypes[0], {status : ProjectChangeRequestItemStatus.Incomplete});
      context.testData.createPCRItem(pcr, recordTypes[1], {status : ProjectChangeRequestItemStatus.Incomplete});

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      expect(dto.items.length).toBe(2);

      dto.items.push({
        ...dto.items[1],
      });

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

  describe("Scope Change", () => {
    test("returns bad request if no summary or description is sent when the item is complete", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const scopeChangeTypeName = PCRRecordTypeMetaValues.find(x => x.type === ProjectChangeRequestItemTypeEntity.ScopeChange)!.typeName;

      const recordType = recordTypes.find(x => x.type === scopeChangeTypeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: Entites.ProjectChangeRequestItemStatus.Complete
      });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForScopeChangeDto;

      item.publicDescription = null as any;
      item.projectSummary = null as any;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.status = Entites.ProjectChangeRequestItemStatus.Incomplete;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("saves the public description and project summary", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const scopeChangeTypeName = PCRRecordTypeMetaValues.find(x => x.type === ProjectChangeRequestItemTypeEntity.ScopeChange)!.typeName;

      const recordType = recordTypes.find(x => x.type === scopeChangeTypeName);
      context.testData.createPCRItem(projectChangeRequest, recordType);

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForScopeChangeDto;

      item.publicDescription = "A marvelous description";
      item.projectSummary = "An inspirational summary";
      await context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto));

      const updatedDto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const updatedScopeChangeItem = updatedDto.items[0] as PCRItemForScopeChangeDto;
      expect(updatedScopeChangeItem.publicDescription).toEqual("A marvelous description");
      expect(updatedScopeChangeItem.projectSummary).toEqual("An inspirational summary");
    });
  });

  describe("Time extension", () => {
    test("returns bad request if no date is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();
      const recordType = recordTypes.find(x => x.type === "Change project duration");
      context.testData.createPCRItem(projectChangeRequest, recordType);

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForTimeExtensionDto;

      item.projectEndDate = null;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.projectEndDate = new Date("2020/01/31");
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns bad request if invalid date is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();
      const recordType = recordTypes.find(x => x.type === "Change project duration");
      context.testData.createPCRItem(projectChangeRequest, recordType);

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForTimeExtensionDto;

      item.projectEndDate = new Date("This is an invalid date");
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.projectEndDate = new Date("2020/01/31");
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns bad request if date sent is not end of month", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();
      const recordType = recordTypes.find(x => x.type === "Change project duration");
      context.testData.createPCRItem(projectChangeRequest, recordType);

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForTimeExtensionDto;

      item.projectEndDate = new Date("2020/01/01");
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.projectEndDate = new Date("2020/01/31");
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns success if date sent is end of month", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();
      const recordType = recordTypes.find(x => x.type === "Change project duration");
      context.testData.createPCRItem(projectChangeRequest, recordType);

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForTimeExtensionDto;

      item.projectEndDate = new Date("2020/01/31");
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);

      const updated = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const updatedItem = updated.items[0] as PCRItemForTimeExtensionDto;
      await expect(updatedItem.projectEndDate).toEqual(new Date("2020/01/31"));
    })
  });

  describe("Project Suspension", () => {
    test("returns bad request if no start date is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === ProjectChangeRequestItemTypeEntity.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: ProjectChangeRequestItemStatus.Complete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;

      item.suspensionStartDate = null;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("returns bad request if invalid date is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === ProjectChangeRequestItemTypeEntity.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: ProjectChangeRequestItemStatus.Incomplete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      item.suspensionStartDate = new Date("bad, bad date");
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("returns bad request if start date is not start of month", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === ProjectChangeRequestItemTypeEntity.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: ProjectChangeRequestItemStatus.Incomplete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      item.suspensionStartDate = DateTime.local().plus({ years: 1 }).startOf("month").plus({days: 1}).toJSDate();
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("returns bad request if end date is not end of month", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === ProjectChangeRequestItemTypeEntity.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: ProjectChangeRequestItemStatus.Incomplete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      item.suspensionEndDate = DateTime.local().plus({ years: 1 }).endOf("month").minus({days: 1}).toJSDate();
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("updates suspension start date and end date", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: ProjectChangeRequestStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === ProjectChangeRequestItemTypeEntity.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: ProjectChangeRequestItemStatus.Incomplete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      const startDate = DateTime.local().plus({ years: 1 }).startOf("month").toJSDate();
      const endDate = DateTime.local().plus({ years: 2 }).endOf("month").toJSDate();
      item.suspensionStartDate = startDate;
      item.suspensionEndDate = endDate;

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);

      const updated = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const updatedItem = updated.items[0] as PCRItemForProjectSuspensionDto;
      await expect(updatedItem.suspensionStartDate!.toISOString()).toEqual(startDate.toISOString());
      await expect(updatedItem.suspensionEndDate!.toISOString()).toEqual(endDate.toISOString());
    })
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
    dto.comments = "Test Comments";

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
