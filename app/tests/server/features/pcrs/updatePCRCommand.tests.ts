// tslint:disable
import { DateTime } from "luxon";
import { TestContext } from "../../testContextProvider";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ValidationError } from "@server/features/common";
import {
  Authorisation,
  PCRDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRStandardItemDto,
  ProjectRole
} from "@framework/types";
import { getAllEnumValues } from "@shared/enumHelper";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";
import {
  PCRItemStatus,
  PCRItemType,
  PCRStatus
} from "@framework/constants";

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
      const recordTypes = context.testData.createPCRRecordTypes();
      const projectTerminationType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectTermination)!;
      const recordType = recordTypes.find(x => x.type === projectTerminationType.typeName);

      context.testData.createPCRItem(pcr, recordType);

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
      const recordTypes = context.testData.createPCRRecordTypes();
      const projectTerminationType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectTermination)!;
      const recordType = recordTypes.find(x => x.type === projectTerminationType.typeName);

      context.testData.createPCRItem(pcr, recordType);

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
      const recordTypes = context.testData.createPCRRecordTypes();
      const projectTerminationType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectTermination)!;
      const recordType = recordTypes.find(x => x.type === projectTerminationType.typeName);

      context.testData.createPCRItem(pcr, recordType);

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.reasoningStatus = PCRItemStatus.Complete;
      dto.reasoningComments = "New reasoning comments";
      dto.comments = "New comments";

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });

    test("reasoning comments are required when reasoning status is complete", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, {status: PCRStatus.Draft});
      context.testData.createPCRItem(pcr, undefined, { status: PCRItemStatus.ToDo });

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

      dto.reasoningComments = "";
      dto.reasoningStatus = PCRItemStatus.Complete;

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, dto))).rejects.toThrow(ValidationError);

      dto.reasoningComments = "Test Comments";

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, dto))).resolves.toBe(true);
    });

    test("updates item status", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft, reasoningStatus: PCRItemStatus.Complete });
      const recordTypes = context.testData.range(3, x => context.testData.createRecordType({ parent: "Acc_ProjectChangeRequest__c"}));
      recordTypes[0].type = "Remove a partner";
      recordTypes[1].type = "Add a partner";
      recordTypes[2].type = "Change project scope";

      recordTypes.forEach(r => context.testData.createPCRItem(pcr, r, {status : PCRItemStatus.Incomplete}));

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      expect(dto.items.length).toBe(3);

      dto.items[1].status = PCRItemStatus.Complete;

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await context.runCommand(command);

      expect(pcr.items.map(x => x.status).sort()).toEqual([PCRItemStatus.Incomplete, PCRItemStatus.Complete, PCRItemStatus.Incomplete ].sort());
    });

    test("adds items", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createPartner(project);
      const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft, reasoningStatus: PCRItemStatus.Complete });
      const recordTypes = context.testData.range(3, x => context.testData.createRecordType({ parent: "Acc_ProjectChangeRequest__c"}));
      recordTypes[0].type = "Remove a partner";
      recordTypes[1].type = "Put project on hold";
      recordTypes[2].type = "Change project scope";

      context.testData.createPCRItem(pcr, recordTypes[0], {status : PCRItemStatus.Incomplete});
      context.testData.createPCRItem(pcr, recordTypes[1], {status : PCRItemStatus.Incomplete});

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      expect(dto.items.length).toBe(2);

      dto.items.push({
        status: PCRItemStatus.ToDo,
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
      const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft, reasoningStatus: PCRItemStatus.Complete });
      const recordTypes = context.testData.createPCRRecordTypes();

      context.testData.createPCRItem(pcr, recordTypes[0], {status : PCRItemStatus.Incomplete});
      context.testData.createPCRItem(pcr, recordTypes[1], {status : PCRItemStatus.Incomplete});

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
      dto.comments = "Some comments";

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

  describe("Scope Change", () => {
    test("returns bad request if no summary or description is sent when the item is complete", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const scopeChangeTypeName = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ScopeChange)!.typeName;

      const recordType = recordTypes.find(x => x.type === scopeChangeTypeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Complete
      });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForScopeChangeDto;

      item.publicDescription = null as any;
      item.projectSummary = null as any;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.status = PCRItemStatus.Incomplete;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("saves the public description and project summary", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const scopeChangeTypeName = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ScopeChange)!.typeName;

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
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
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
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
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
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
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
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
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
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.Complete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;

      item.suspensionStartDate = null;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("returns bad request if invalid date is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.Incomplete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      item.suspensionStartDate = new Date("bad, bad date");
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("returns bad request if start date is not start of month", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.Incomplete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      item.suspensionStartDate = DateTime.local().plus({ years: 1 }).startOf("month").plus({days: 1}).toJSDate();
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("returns bad request if end date is not end of month", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.Incomplete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      item.suspensionEndDate = DateTime.local().plus({ years: 1 }).endOf("month").minus({days: 1}).toJSDate();
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("updates suspension start date and end date", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.Incomplete});

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

  describe("Account Name Change", () => {
    test("returns bad request if partnerId and account name are not sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.AccountNameChange)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.Complete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForAccountNameChangeDto;

      item.accountName = null;
      item.partnerId = partner.Id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.accountName = "New Name Goes Here";
      item.partnerId = null;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.accountName = "New Name Goes Here";
      item.partnerId = partner.Id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns bad request if partner does not belong to project", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const projectPartner = context.testData.createPartner(project);
      const otherPartner = context.testData.createPartner();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.AccountNameChange)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.Complete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForAccountNameChangeDto;

      item.accountName = "New Name Goes Here";
      item.partnerId = otherPartner.Id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.accountName = "New Name Goes Here";
      item.partnerId = projectPartner.Id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("updates account name and partner", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, {status: PCRStatus.Draft});
      const recordTypes = context.testData.createPCRRecordTypes();

      const accountNameChangeType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.AccountNameChange)!;

      const recordType = recordTypes.find(x => x.type === accountNameChangeType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.Complete});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForAccountNameChangeDto;

      item.accountName = "New Name Goes Here";
      item.partnerId = partner.Id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);

      const updated = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const updatedItem = updated.items[0] as PCRItemForAccountNameChangeDto;
      await expect(updatedItem.accountName).toEqual("New Name Goes Here");
      await expect(updatedItem.partnerId).toEqual(partner.Id);
    })
  });

  test("updates pcr fields if pm", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft });
    const recordTypes = context.testData.createPCRRecordTypes();
    const projectTerminationType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectTermination)!;
    const recordType = recordTypes.find(x => x.type === projectTerminationType.typeName);

    context.testData.createPCRItem(pcr, recordType);

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

    const recordTypes = context.testData.createPCRRecordTypes();
    const projectTerminationType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectTermination)!;
    const recordType = recordTypes.find(x => x.type === projectTerminationType.typeName);

    context.testData.createPCRItem(pcr, recordType);

    context.testData.createCurrentUserAsProjectManager(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = PCRStatus.SubmittedToMonitoringOfficer;

    await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

    expect(pcr.status).toBe(PCRStatus.SubmittedToMonitoringOfficer);
  });

  test("if user is PM can update status from Quried by Innovate to Submitted to Innovate", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: PCRStatus.QueriedByInnovateUK });

    const recordTypes = context.testData.createPCRRecordTypes();
    const projectTerminationType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectTermination)!;
    const recordType = recordTypes.find(x => x.type === projectTerminationType.typeName);

    context.testData.createPCRItem(pcr, recordType);

    context.testData.createCurrentUserAsProjectManager(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = PCRStatus.SubmittedToInnovationLead;

    await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

    expect(pcr.status).toBe(PCRStatus.SubmittedToInnovationLead);
  });

  test("if user is MO can update status to QueriedByMonitoringOfficer ", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const pcr = context.testData.createPCR(project, { status: PCRStatus.SubmittedToMonitoringOfficer });
    context.testData.createPCRItem(pcr);

    context.testData.createCurrentUserAsMonitoringOfficer(project);

    const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

    dto.status = PCRStatus.QueriedByMonitoringOfficer;
    dto.comments = "Test Comments";

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
