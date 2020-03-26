// tslint:disable
import { DateTime } from "luxon";
import { TestContext } from "../../testContextProvider";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ValidationError } from "@server/features/common";
import {
  Authorisation,
  PCRContactRole,
  PCRDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForMultiplePartnerFinancialVirementDto,
  PCRItemForPartnerAdditionDto,
  PCRItemForPartnerWithdrawalDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectRole,
  PCRStandardItemDto,
  ProjectRole
} from "@framework/types";
import { getAllEnumValues } from "@shared/enumHelper";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";
import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants";

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
      const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft });
      context.testData.createPCRItem(pcr, undefined, { status: PCRItemStatus.ToDo });

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

      dto.reasoningComments = "";
      dto.reasoningStatus = PCRItemStatus.Complete;

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, dto))).rejects.toThrow(ValidationError);

      dto.reasoningComments = "Test Comments";

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, dto))).resolves.toBe(true);
    });

    test("adds items", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createPartner(project);
      const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft, reasoningStatus: PCRItemStatus.Complete });
      const recordTypes = context.testData.range(3, x => context.testData.createRecordType({ parent: "Acc_ProjectChangeRequest__c" }));
      recordTypes[0].type = "Remove a partner";
      recordTypes[1].type = "Put project on hold";
      recordTypes[2].type = "Change project scope";

      context.testData.createPCRItem(pcr, recordTypes[0], { status: PCRItemStatus.Incomplete });
      context.testData.createPCRItem(pcr, recordTypes[1], { status: PCRItemStatus.Incomplete });

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

      context.testData.createPCRItem(pcr, recordTypes[0], { status: PCRItemStatus.Incomplete });
      context.testData.createPCRItem(pcr, recordTypes[1], { status: PCRItemStatus.Incomplete });

      context.testData.createCurrentUserAsProjectManager(project);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      expect(dto.items.length).toBe(2);

      dto.items.push({
        ...dto.items[1],
      });

      const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });

    it("adds status change record if status is changing", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);

      const recordTypes = context.testData.createPCRRecordTypes();
      const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft, reasoningStatus: PCRItemStatus.Complete });
      context.testData.createPCRItem(pcr, recordTypes[0], { status: PCRItemStatus.Complete });

      expect(context.repositories.projectChangeRequestStatusChange.Items.length).toBe(0);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.status = PCRStatus.SubmittedToMonitoringOfficer;
      dto.comments = "Expected Comments"

      await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

      expect(context.repositories.projectChangeRequestStatusChange.Items.length).toBe(1);

      const statusChange = context.repositories.projectChangeRequestStatusChange.Items[0];
      expect(statusChange.externalComments).toBe("Expected Comments");
      expect(statusChange.pcrId).toBe(pcr.id);
      expect(statusChange.previousStatus).toBe(PCRStatus.Draft);
      expect(statusChange.newStatus).toBe(PCRStatus.SubmittedToMonitoringOfficer);
      expect(statusChange.participantVisibility).toBe(true);

      expect(pcr.comments).toBe("");
    });

    it("status change record comments not participant visible if submitting to innovate", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsMonitoringOfficer(project);

      const recordTypes = context.testData.createPCRRecordTypes();
      const pcr = context.testData.createPCR(project, { status: PCRStatus.SubmittedToMonitoringOfficer, reasoningStatus: PCRItemStatus.Complete });
      context.testData.createPCRItem(pcr, recordTypes[0], { status: PCRItemStatus.Complete });

      expect(context.repositories.projectChangeRequestStatusChange.Items.length).toBe(0);

      const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
      dto.status = PCRStatus.SubmittedToInnovationLead;
      dto.comments = "Expected Comments"

      await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

      expect(context.repositories.projectChangeRequestStatusChange.Items.length).toBe(1);

      const statusChange = context.repositories.projectChangeRequestStatusChange.Items[0];
      expect(statusChange.participantVisibility).toBe(false);
    });
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
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
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
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
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
    test("returns bad request if no project extension is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();
      const recordType = recordTypes.find(x => x.type === "Change project duration");
      context.testData.createPCRItem(projectChangeRequest, recordType);

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForTimeExtensionDto;

      item.additionalMonths = null;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.additionalMonths = 3;

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns bad request if invalid project extension is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();
      const recordType = recordTypes.find(x => x.type === "Change project duration");
      context.testData.createPCRItem(projectChangeRequest, recordType);

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForTimeExtensionDto;

      item.additionalMonths = -5;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.additionalMonths = 1.5;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.additionalMonths = 5;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns success if date sent is end of month", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();
      const recordType = recordTypes.find(x => x.type === "Change project duration");
      context.testData.createPCRItem(projectChangeRequest, recordType);

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForTimeExtensionDto;

      item.additionalMonths = 5;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);

      const updated = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const updatedItem = updated.items[0] as PCRItemForTimeExtensionDto;
      await expect(updatedItem.additionalMonths).toEqual(5);
    })

    it("correctly updates the project duration", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();
      const recordType = recordTypes.find(x => x.type === "Change project duration");
      context.testData.createPCRItem(projectChangeRequest, recordType);

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForTimeExtensionDto;

      item.additionalMonths = 5;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);

      const updatedItem = context.repositories.projectChangeRequests.Items.find(x => x.id === projectChangeRequest.id)!.items.find(x => x.id === item.id)!;
      await expect(updatedItem.projectDuration).toEqual(item.additionalMonths + item.projectDurationSnapshot);
    })
  });

  describe("Partner addition", () => {
    const setup = () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();
      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.PartnerAddition)!;
      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      return {context, recordType, projectChangeRequest, project};
    };
    it("should require project role and partner type to be set", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });
      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerAdditionDto;
      item.projectRole = PCRProjectRole.Unknown;
      item.partnerType = PCRPartnerType.Unknown;
      const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });
    it("should require organisation name to be set when the partner type is Research", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        partnerType: PCRPartnerType.Research,
        projectRole: PCRProjectRole.Collaborator,
        projectCity: "Coventry",
        turnover: 33,
        turnoverYearEnd: new Date(),
        contact1ProjectRole: PCRContactRole.FinanceContact,
        contact1Forename: "Homer",
        contact1Surname: "Of Iliad fame",
        contact1Phone: "112233",
        contact1Email: "helen@troy.com",
        participantSize: PCRParticipantSize.Medium,
        numberOfEmployees: 15,
      });
      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerAdditionDto;
      item.status = PCRItemStatus.Complete;
      const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
      item.organisationName = "Coventry University";
      await expect(context.runCommand(command)).resolves.toBe(true);
    });
    it("should require finance contact details to be set", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        partnerType: PCRPartnerType.Business,
        projectRole: PCRProjectRole.Collaborator,
        projectCity: "Coventry",
        participantSize: PCRParticipantSize.Medium,
        numberOfEmployees: 15,
      });
      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerAdditionDto;
      item.status = PCRItemStatus.Complete;
      const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
      item.contact1ProjectRole = PCRContactRole.FinanceContact;
      item.contact1Forename = "Homer";
      item.contact1Surname = "Of Iliad fame";
      item.contact1Phone = "112233";
      item.contact1Email = "helen@troy.com";
      await expect(context.runCommand(command)).resolves.toBe(true);
    });
    it("should require organisation details to be set", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        partnerType: PCRPartnerType.Business,
        projectRole: PCRProjectRole.Collaborator,
        projectCity: "Coventry",
        contact1ProjectRole: PCRContactRole.FinanceContact,
        contact1Forename: "Homer",
        contact1Surname: "Of Iliad fame",
        contact1Phone: "112233",
        contact1Email: "helen@troy.com",
      });
      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerAdditionDto;
      item.status = PCRItemStatus.Complete;
      const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
      item.participantSize = PCRParticipantSize.Medium;
      item.numberOfEmployees = 15
      await expect(context.runCommand(command)).resolves.toBe(true);
    })
    it("should not allow updates to project role & partner type fields once they are set", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Research });
      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerAdditionDto;
      item.projectRole = PCRProjectRole.ProjectLead;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
      item.projectRole = PCRProjectRole.Collaborator;
      item.partnerType = PCRPartnerType.ResearchAndTechnology;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });
    it("should update item status", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
        projectCity: "Bristol",
        projectPostcode: "BS1 5UW",
        contact1ProjectRole: PCRContactRole.FinanceContact,
        contact1Forename: "Marjorie",
        contact1Surname: "Evans",
        contact1Phone: "020000111",
        contact1Email: "marj@evans.com",
        participantSize: PCRParticipantSize.Large,
        numberOfEmployees: 150,
      });
      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerAdditionDto;
      item.status = PCRItemStatus.Complete;
      await expect(await context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).toBe(true);
      const updated = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const updatedItem = updated.items[0] as PCRItemForPartnerAdditionDto;
      expect(updatedItem.status).toEqual(PCRItemStatus.Complete);
    });
    it("should update the relevant fields", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });
      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerAdditionDto;
      const turnoverYearEnd = new Date();
      item.contact1ProjectRole = PCRContactRole.FinanceContact;
      item.contact1Forename = "Marjorie";
      item.contact1Surname = "Evans";
      item.contact1Phone = "020000111";
      item.contact1Email = "marj@evans.com";
      item.turnoverYearEnd = turnoverYearEnd;
      item.turnover = 45;
      item.organisationName = "Bristol University";
      item.projectRole = PCRProjectRole.ProjectLead;
      item.partnerType = PCRPartnerType.Other;
      item.projectCity = "Bristol";
      item.projectPostcode = "BS1 5UW";
      item.participantSize = PCRParticipantSize.Medium;
      item.numberOfEmployees = 0;

      const command = new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto);
      await expect(await context.runCommand(command)).toBe(true);
      const updated = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const updatedItem = updated.items[0] as PCRItemForPartnerAdditionDto;
      expect(updatedItem.contact1ProjectRole).toEqual(PCRContactRole.FinanceContact);
      expect(updatedItem.contact1Forename).toEqual("Marjorie");
      expect(updatedItem.contact1Surname).toEqual("Evans");
      expect(updatedItem.contact1Phone).toEqual("020000111");
      expect(updatedItem.contact1Email).toEqual("marj@evans.com");
      expect(updatedItem.turnoverYearEnd).toEqual(turnoverYearEnd);
      expect(updatedItem.turnover).toEqual(45);
      expect(updatedItem.organisationName).toEqual("Bristol University");
      expect(updatedItem.projectRole).toEqual(PCRProjectRole.ProjectLead);
      expect(updatedItem.partnerType).toEqual(PCRPartnerType.Other);
      expect(updatedItem.projectCity).toEqual("Bristol");
      expect(updatedItem.projectPostcode).toEqual("BS1 5UW");
      expect(updatedItem.participantSize).toEqual(PCRParticipantSize.Medium);
      expect(updatedItem.numberOfEmployees).toEqual(0);
    });
  });

  describe("Project Suspension", () => {
    test("returns bad request if no start date is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;

      item.suspensionStartDate = null;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("returns bad request if invalid date is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      item.suspensionStartDate = new Date("bad, bad date");
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("returns bad request if start date is not start of month", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      item.suspensionStartDate = DateTime.local().plus({ years: 1 }).startOf("month").plus({ days: 1 }).toJSDate();
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("returns bad request if end date is not end of month", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForProjectSuspensionDto;
      item.suspensionEndDate = DateTime.local().plus({ years: 1 }).endOf("month").minus({ days: 1 }).toJSDate();
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);
    });

    test("updates suspension start date and end date", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.ProjectSuspension)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });

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
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.AccountNameChange)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForAccountNameChangeDto;

      item.accountName = null;
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.accountName = "New Name Goes Here";
      item.partnerId = null;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.accountName = "New Name Goes Here";
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns bad request if partner does not belong to project", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const projectPartner = context.testData.createPartner(project);
      const otherPartner = context.testData.createPartner();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.AccountNameChange)!;

      const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForAccountNameChangeDto;

      item.accountName = "New Name Goes Here";
      item.partnerId = otherPartner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.accountName = "New Name Goes Here";
      item.partnerId = projectPartner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("updates account name and partner", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const accountNameChangeType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.AccountNameChange)!;

      const recordType = recordTypes.find(x => x.type === accountNameChangeType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForAccountNameChangeDto;

      item.accountName = "New Name Goes Here";
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);

      const updated = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const updatedItem = updated.items[0] as PCRItemForAccountNameChangeDto;
      await expect(updatedItem.accountName).toEqual("New Name Goes Here");
      await expect(updatedItem.partnerId).toEqual(partner.id);
    });

    test("cannot rename withdrawn partner", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });

      context.testData.createCurrentUserAsProjectManager(project);

      const accountNameChangeType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.AccountNameChange)!;
      const recordType = context.testData.createPCRRecordTypes().find(x => x.type === accountNameChangeType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.ToDo});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForAccountNameChangeDto;
      item.partnerId = partner.id;
      item.accountName = "New account name";

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);

      partner.participantStatus = "Involuntary Withdrawal";

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

    });

  });

  describe("Partner withdrawal", () => {
    test("returns a bad request if partnerId and withdrawal date are not sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const partnerWithdrawalType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.PartnerWithdrawal)!;

      const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

      item.withdrawalDate = null;
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.withdrawalDate = new Date();
      item.partnerId = null;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.withdrawalDate = new Date();
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns a bad request if partner does not belong to project", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const projectPartner = context.testData.createPartner(project);
      const otherPartner = context.testData.createPartner();
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const partnerWithdrawalType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.PartnerWithdrawal)!;

      const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

      item.withdrawalDate = new Date();
      item.partnerId = otherPartner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.withdrawalDate = new Date();
      item.partnerId = projectPartner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns a bad request if an invalid withdrawal date is sent", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const partnerWithdrawalType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.PartnerWithdrawal)!;

      const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

      item.withdrawalDate = new Date("58rd Augcember √-1992");
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.withdrawalDate = new Date();
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("returns a bad request if withdrawal date before project start date", async () => {
      const context = new TestContext();

      const project = context.testData.createProject(x => {x.Acc_StartDate__c = "2020-01-01"; x.Acc_ClaimFrequency__c = "Monthly"});
      const partner = context.testData.createPartner(project);
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const partnerWithdrawalType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.PartnerWithdrawal)!;

      const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

      item.withdrawalDate = new Date("01/01/2019");
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.withdrawalDate = new Date("01/12/2019");
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.withdrawalDate = new Date("01/05/2020");
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });

    test("updates withdrawal date and partner", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const partnerWithdrawalType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.PartnerWithdrawal)!;

      const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

      const date = new Date();

      item.withdrawalDate = date;
      item.partnerId = partner.id;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);

      const update = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const updateItem = update.items[0] as PCRItemForPartnerWithdrawalDto;
      await expect(updateItem.withdrawalDate).toEqual(date);
      await expect(updateItem.partnerId).toBe(partner.id);
    });

    test("cannot withdraw withdrawn partner", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });

      context.testData.createCurrentUserAsProjectManager(project);

      const partnerWithdrawalType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.PartnerWithdrawal)!;
      const recordType = context.testData.createPCRRecordTypes().find(x => x.type === partnerWithdrawalType.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, {status: PCRItemStatus.ToDo});

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;
      item.withdrawalDate = new Date();
      item.partnerId = partner.id;
      item.status = PCRItemStatus.Complete;

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);

      partner.participantStatus = "Involuntary Withdrawal";

      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

    });
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
  describe("PCR Multiple partner virement", () => {
    test("Grant carried over financial year field gets created, validated, and updated properly", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      context.testData.createCurrentUserAsProjectManager(project);
      const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
      const recordTypes = context.testData.createPCRRecordTypes();

      const multiplePartnerFinancialVirement = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.MultiplePartnerFinancialVirement)!;

      const recordType = recordTypes.find(x => x.type === multiplePartnerFinancialVirement.typeName);
      context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

      const dto = await context.runQuery(new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id));
      const item = dto.items[0] as PCRItemForMultiplePartnerFinancialVirementDto;

      item.grantMovingOverFinancialYear = -1;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).rejects.toThrow(ValidationError);

      item.grantMovingOverFinancialYear =  100;
      await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(true);
    });
  });
});
