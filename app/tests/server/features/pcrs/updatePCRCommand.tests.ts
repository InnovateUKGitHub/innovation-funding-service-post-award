import { DateTime } from "luxon";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { InActiveProjectError, ValidationError } from "@server/features/common";
import {
  Authorisation,
  PCRDto,
  PCRItemDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForLoanDrawdownExtensionDto,
  PCRItemForMultiplePartnerFinancialVirementDto,
  PCRItemForPartnerWithdrawalDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRStandardItemDto,
  ProjectRole,
} from "@framework/types";
import { getAllEnumValues } from "@shared/enumHelper";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants";
import { TestContext } from "../../testContextProvider";

describe("UpdatePCRCommand", () => {
  test("throws an error when the project is inactive", async () => {
    const context = new TestContext();

    const project = context.testData.createProject(x => (x.Acc_ProjectStatus__c = "On Hold"));
    context.testData.createCurrentUserAsProjectManager(project);
    const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });

    const pcrDtoQuery = new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id);
    const dto = await context.runQuery(pcrDtoQuery);

    const command = context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto));

    await expect(command).rejects.toThrow(InActiveProjectError);
  });

  describe("with access control", () => {
    const setAccessControl = (role: ProjectRole) => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const auth = new Authorisation({ [project.Id]: { projectRoles: role, partnerRoles: {} } });
      const command = new UpdatePCRCommand(project.Id, "", {} as PCRDto);

      return context.runAccessControl(auth, command);
    };

    describe("with invalid roles", () => {
      test("when FC", async () => {
        const runAccessControl = setAccessControl(ProjectRole.FinancialContact);

        expect(await runAccessControl).toBeFalsy();
      });
    });

    describe("with valid roles", () => {
      test("when PM", async () => {
        const runAccessControl = setAccessControl(ProjectRole.ProjectManager);

        expect(await runAccessControl).toBeTruthy();
      });

      test("when MO", async () => {
        const runAccessControl = setAccessControl(ProjectRole.MonitoringOfficer);

        expect(await runAccessControl).toBeTruthy();
      });
    });
  });

  describe("with PCR Items based from existing PCRs", () => {
    describe("should throw a validation error with existing PCRs", () => {
      const setupExistingPcrItemTestBed = async (pcrItemsToCheck: PCRItemType[]) => {
        const context = new TestContext();

        const allRecordTypes = context.testData.createPCRRecordTypes();
        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft });

        context.testData.createCurrentUserAsProjectManager(project);

        const pcrDto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

        // Note: Were getting all the data we need based on the PCR Item and ensuring validity
        const recordsToCreate = pcrItemsToCheck.map(pcrItem => {
          const metaValue = GetPCRItemTypesQuery.recordTypeMetaValues.find(x => x.type === pcrItem);

          if (!metaValue) {
            throw new Error(`recordTypeMetaValues item was not found: ${pcrItem}`);
          }

          const recordType = allRecordTypes.find(x => x.type === metaValue.typeName);

          if (!recordType) {
            throw new Error(`PCRItemType was not found: ${pcrItem}`);
          }

          return { metaValue, recordType };
        });

        // Note: We're creating test data since we need to check against an existing scopeChangePcrItem
        for (let recordIndex = 0; recordIndex < pcrItemsToCheck.length; recordIndex++) {
          const pcrRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });

          context.testData.createPCRItem(pcrRequest, recordsToCreate[recordIndex].recordType, {
            status: PCRItemStatus.Complete,
          });
        }

        const pcrItems = recordsToCreate.map(
          (_, i) =>
            ({
              type: recordsToCreate[i].metaValue.type,
              status: PCRItemStatus.ToDo,
              accountName: "stub-accountName",
              partnerId: partner.id,
            } as PCRItemDto),
        );

        return {
          context,
          project,
          pcr,
          pcrDto,
          pcrItems,
        };
      };

      test("when a singular PCR Item already in progress", async () => {
        const itemTypeToCreate = [PCRItemType.ScopeChange];
        const { context, project, pcrItems, pcrDto, pcr } = await setupExistingPcrItemTestBed(itemTypeToCreate);

        if (pcrItems.length !== itemTypeToCreate.length) {
          throw new Error(
            `It appears there are not enough test data to preform this test. You should have total item count of "${itemTypeToCreate.length}".`,
          );
        }

        const pcrPayload = {
          ...pcrDto,
          items: pcrItems,
        } as PCRDto;

        const command = new UpdatePCRCommand(project.Id, pcr.id, pcrPayload);

        await expect(context.runCommand(command)).rejects.toThrowError(ValidationError);
      });

      test("when a multiple PCR Items are already in progress", async () => {
        const itemTypesToCreate = [PCRItemType.ScopeChange, PCRItemType.TimeExtension];
        const { context, project, pcrItems, pcrDto, pcr } = await setupExistingPcrItemTestBed(itemTypesToCreate);

        if (pcrItems.length !== itemTypesToCreate.length) {
          throw new Error(
            `It appears there are not enough test data to preform this test. You should have total item count of "${itemTypesToCreate.length}".`,
          );
        }

        const pcrPayload = {
          ...pcrDto,
          items: pcrItems,
        } as PCRDto;

        const command = new UpdatePCRCommand(project.Id, pcr.id, pcrPayload);

        await expect(context.runCommand(command)).rejects.toThrowError(ValidationError);
      });
    });
  });

  describe("with scenario specific updates", () => {
    describe("when a PM", () => {
      const validStatusChanges = [
        { from: PCRStatus.Draft, to: PCRStatus.SubmittedToMonitoringOfficer },
        { from: PCRStatus.QueriedByMonitoringOfficer, to: PCRStatus.SubmittedToMonitoringOfficer },
        { from: PCRStatus.QueriedByInnovateUK, to: PCRStatus.SubmittedToInnovateUK },
      ];

      test.each(
        validStatusChanges.map<[string, string, PCRStatus, PCRStatus]>(x => [
          PCRStatus[x.from],
          PCRStatus[x.to],
          x.from,
          x.to,
        ]),
      )("can update from %s to %s", async (fromString, toString, from: PCRStatus, to: PCRStatus) => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const pcr = context.testData.createPCR(project, { status: from });
        const recordTypes = context.testData.createPCRRecordTypes();
        const projectTerminationType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectTermination,
        )!;
        const recordType = recordTypes.find(x => x.type === projectTerminationType.typeName);

        context.testData.createPCRItem(pcr, recordType);

        context.testData.createCurrentUserAsProjectManager(project);

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
        dto.status = to;

        const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

        await context.runCommand(command);

        expect(pcr.status).toBe(dto.status);
      });

      const validEditStatus = [PCRStatus.Draft, PCRStatus.QueriedByInnovateUK, PCRStatus.QueriedByMonitoringOfficer];

      test.each(
        validEditStatus.map<[string, PCRStatus]>(x => [PCRStatus[x], x]),
      )("can update when %s", async (label, status) => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const pcr = context.testData.createPCR(project, {
          status,
          reasoningStatus: PCRItemStatus.Complete,
          comments: "Comments",
          reasoning: "Reasoning",
        });
        const recordTypes = context.testData.createPCRRecordTypes();
        const projectTerminationType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectTermination,
        )!;
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

      test.each(
        invalidEditStatus.map<[string, PCRStatus]>(x => [PCRStatus[x], x]),
      )("can not update when %s", async (stausLabel, status) => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const pcr = context.testData.createPCR(project, {
          status,
          reasoningStatus: PCRItemStatus.Complete,
          comments: "Comments",
          reasoning: "Reasoning",
        });
        const recordTypes = context.testData.createPCRRecordTypes();
        const projectTerminationType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectTermination,
        )!;
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
        context.testData.createPCRRecordTypes();
        context.testData.createPCRItem(pcr, undefined, { status: PCRItemStatus.ToDo });
        context.testData.createCurrentUserAsProjectManager(project);

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

        dto.reasoningComments = "";
        dto.reasoningStatus = PCRItemStatus.Complete;

        await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, dto))).rejects.toThrow(
          ValidationError,
        );

        dto.reasoningComments = "Test Comments";

        await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, dto))).resolves.toBe(true);
      });

      test("adds items", async () => {
        const context = new TestContext();

        const recordTypes = context.testData.createPCRRecordTypes();
        const project = context.testData.createProject();
        context.testData.createPartner(project);
        const pcr = context.testData.createPCR(project, {
          status: PCRStatus.Draft,
          reasoningStatus: PCRItemStatus.Complete,
        });

        const removePartnerRecord = recordTypes.find(x => x.type === "Remove a partner");
        const projectOnHoldRecord = recordTypes.find(x => x.type === "Put project on hold");
        const changeProjectScopeRecord = recordTypes.find(x => x.type === "Change project scope");

        if (!removePartnerRecord || !projectOnHoldRecord || !changeProjectScopeRecord) {
          throw Error("1 or record types was missing that was needed");
        }

        context.testData.createPCRItem(pcr, removePartnerRecord, { status: PCRItemStatus.Incomplete });
        context.testData.createPCRItem(pcr, projectOnHoldRecord, { status: PCRItemStatus.Incomplete });

        context.testData.createCurrentUserAsProjectManager(project);

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

        expect(dto.items).toHaveLength(2);

        const additionalItem = {
          status: PCRItemStatus.ToDo,
          // Note: We know this always returns a defined value as we would have thrown on 'changeProjectScopeRecord'
          type: GetPCRItemTypesQuery.recordTypeMetaValues.find(x => x.typeName === changeProjectScopeRecord.type)!.type,
        };

        dto.items.push(additionalItem as PCRStandardItemDto);

        const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

        await context.runCommand(command);

        expect(pcr.items).toHaveLength(3);
      });

      it("does not allow duplicate item types", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createPartner(project);
        const pcr = context.testData.createPCR(project, {
          status: PCRStatus.Draft,
          reasoningStatus: PCRItemStatus.Complete,
        });
        const recordTypes = context.testData.createPCRRecordTypes();

        context.testData.createPCRItem(pcr, recordTypes[1], { status: PCRItemStatus.Incomplete });
        context.testData.createPCRItem(pcr, recordTypes[2], { status: PCRItemStatus.Incomplete });

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
        const pcr = context.testData.createPCR(project, {
          status: PCRStatus.Draft,
          reasoningStatus: PCRItemStatus.Complete,
        });
        context.testData.createPCRItem(pcr, recordTypes[0], {
          status: PCRItemStatus.Complete,
          grantMovingOverFinancialYear: 0,
        });

        expect(context.repositories.projectChangeRequestStatusChange.Items.length).toBe(0);

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
        dto.status = PCRStatus.SubmittedToMonitoringOfficer;
        dto.comments = "Expected Comments";

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

      it("status change record comments not participant visible if submitting to innovate uk", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsMonitoringOfficer(project);

        const recordTypes = context.testData.createPCRRecordTypes();
        const pcr = context.testData.createPCR(project, {
          status: PCRStatus.SubmittedToMonitoringOfficer,
          reasoningStatus: PCRItemStatus.Complete,
        });
        context.testData.createPCRItem(pcr, recordTypes[0], { status: PCRItemStatus.Complete });

        expect(context.repositories.projectChangeRequestStatusChange.Items.length).toBe(0);

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
        dto.status = PCRStatus.SubmittedToInnovateUK;
        dto.comments = "Expected Comments";

        await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

        expect(context.repositories.projectChangeRequestStatusChange.Items.length).toBe(1);

        const statusChange = context.repositories.projectChangeRequestStatusChange.Items[0];
        expect(statusChange.participantVisibility).toBe(false);
      });

      test("can update pcr fields", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();
        const projectTerminationType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectTermination,
        )!;
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

      test("can update status from Draft to Submitted to MO ", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft });

        const recordTypes = context.testData.createPCRRecordTypes();
        const projectTerminationType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectTermination,
        )!;
        const recordType = recordTypes.find(x => x.type === projectTerminationType.typeName);

        context.testData.createPCRItem(pcr, recordType);

        context.testData.createCurrentUserAsProjectManager(project);

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

        dto.status = PCRStatus.SubmittedToMonitoringOfficer;

        await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

        expect(pcr.status).toBe(PCRStatus.SubmittedToMonitoringOfficer);
      });

      test("can update status from Queried by Innovate to Submitted to Innovate", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const pcr = context.testData.createPCR(project, { status: PCRStatus.QueriedByInnovateUK });

        const recordTypes = context.testData.createPCRRecordTypes();
        const projectTerminationType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectTermination,
        )!;
        const recordType = recordTypes.find(x => x.type === projectTerminationType.typeName);

        context.testData.createPCRItem(pcr, recordType);

        context.testData.createCurrentUserAsProjectManager(project);

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

        dto.status = PCRStatus.SubmittedToInnovateUK;

        await context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto));

        expect(pcr.status).toBe(PCRStatus.SubmittedToInnovateUK);
      });

      test("cannot update status to Draft", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const pcr = context.testData.createPCR(project, { status: PCRStatus.QueriedByMonitoringOfficer });

        context.testData.createCurrentUserAsProjectManager(project);

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

        dto.status = PCRStatus.Draft;

        await expect(context.runCommand(new UpdatePCRCommand(pcr.projectId, pcr.id, dto))).rejects.toThrow(
          ValidationError,
        );
      });
    });

    describe("when a MO", () => {
      const statusChanges = [
        { from: PCRStatus.SubmittedToMonitoringOfficer, to: PCRStatus.QueriedByMonitoringOfficer },
        { from: PCRStatus.SubmittedToMonitoringOfficer, to: PCRStatus.SubmittedToInnovateUK },
      ];

      test.each(
        statusChanges.map<[string, string, PCRStatus, PCRStatus]>(x => [
          PCRStatus[x.from],
          PCRStatus[x.to],
          x.from,
          x.to,
        ]),
      )("can update from %s to %s", async (fromString, toString, from: PCRStatus, to: PCRStatus) => {
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

      const validEditStatus = [PCRStatus.SubmittedToMonitoringOfficer];

      test.each(
        validEditStatus.map<[string, PCRStatus]>(x => [PCRStatus[x], x]),
      )("can update when %s", async (label, status) => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const pcr = context.testData.createPCR(project, {
          status,
          reasoningStatus: PCRItemStatus.Complete,
          comments: "Comments",
          reasoning: "Reasoning",
        });
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

      test.each(
        invalidEditStatus.map<[string, PCRStatus]>(x => [PCRStatus[x], x]),
      )("can not update when %s", async (stausLabel, status) => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const pcr = context.testData.createPCR(project, {
          status,
          reasoningStatus: PCRItemStatus.Incomplete,
          comments: "Comments",
          reasoning: "Reasoning",
        });

        context.testData.createCurrentUserAsMonitoringOfficer(project);

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));
        dto.comments = "New comments";

        const command = new UpdatePCRCommand(project.Id, pcr.id, dto);

        await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
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
    });
  });

  describe("with each PCR Entity", () => {
    describe("Scope Change", () => {
      test("returns bad request if no summary or description is sent when the item is complete", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const scopeChangeTypeName = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ScopeChange,
        )!.typeName;

        const recordType = recordTypes.find(x => x.type === scopeChangeTypeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, {
          status: PCRItemStatus.Complete,
        });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForScopeChangeDto;

        item.publicDescription = null as any;
        item.projectSummary = null as any;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.status = PCRItemStatus.Incomplete;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );
      });

      test("saves the public description and project summary", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const scopeChangeTypeName = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ScopeChange,
        )!.typeName;

        const recordType = recordTypes.find(x => x.type === scopeChangeTypeName);
        context.testData.createPCRItem(projectChangeRequest, recordType);

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForScopeChangeDto;

        item.publicDescription = "A marvelous description";
        item.projectSummary = "An inspirational summary";
        await context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto));

        const updatedDto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const updatedScopeChangeItem = updatedDto.items[0] as PCRItemForScopeChangeDto;
        expect(updatedScopeChangeItem.publicDescription).toEqual("A marvelous description");
        expect(updatedScopeChangeItem.projectSummary).toEqual("An inspirational summary");
      });
    });

    describe("Time extension", () => {
      test("returns bad request if invalid project extension is sent", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();
        const recordType = recordTypes.find(x => x.type === "Change project duration");
        context.testData.createPCRItem(projectChangeRequest, recordType);

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForTimeExtensionDto;

        item.offsetMonths = 1.5;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);
      });

      test("returns success if date sent is end of month", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();
        const recordType = recordTypes.find(x => x.type === "Change project duration");
        context.testData.createPCRItem(projectChangeRequest, recordType);

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForTimeExtensionDto;

        item.offsetMonths = 5;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );

        const updated = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const updatedItem = updated.items[0] as PCRItemForTimeExtensionDto;
        await expect(updatedItem.offsetMonths).toEqual(5);
      });

      test("should error when given no additional months", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();
        const recordType = recordTypes.find(x => x.type === "Change project duration");
        context.testData.createPCRItem(projectChangeRequest, recordType);

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForTimeExtensionDto;

        item.offsetMonths = 0;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);
      });

      test("correctly updates the project duration when given reduced months", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();
        const recordType = recordTypes.find(x => x.type === "Change project duration");
        context.testData.createPCRItem(projectChangeRequest, recordType);

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForTimeExtensionDto;

        item.offsetMonths = -5;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );
      });

      test("correctly updates the project duration when given additional months", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();
        const recordType = recordTypes.find(x => x.type === "Change project duration");
        context.testData.createPCRItem(projectChangeRequest, recordType);

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForTimeExtensionDto;

        item.offsetMonths = 5;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );

        const updatedItem = context.repositories.projectChangeRequests.Items.find(
          x => x.id === projectChangeRequest.id,
        )!.items.find(x => x.id === item.id)!;
        await expect(updatedItem.projectDuration).toEqual(item.offsetMonths + item.projectDurationSnapshot);
      });
    });

    describe("Project Suspension", () => {
      test("returns bad request if no start date is sent", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const projectSuspensionType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectSuspension,
        )!;

        const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForProjectSuspensionDto;

        item.suspensionStartDate = null;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);
      });

      test("returns bad request if invalid date is sent", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const projectSuspensionType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectSuspension,
        )!;

        const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForProjectSuspensionDto;
        item.suspensionStartDate = new Date("bad, bad date");
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);
      });

      test("returns bad request if start date is not start of month", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const projectSuspensionType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectSuspension,
        )!;

        const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForProjectSuspensionDto;
        item.suspensionStartDate = DateTime.local().plus({ years: 1 }).startOf("month").plus({ days: 1 }).toJSDate();
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);
      });

      test("returns bad request if end date is not end of month", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const projectSuspensionType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectSuspension,
        )!;

        const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForProjectSuspensionDto;
        item.suspensionEndDate = DateTime.local().plus({ years: 1 }).endOf("month").minus({ days: 1 }).toJSDate();
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);
      });

      test("updates suspension start date and end date", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const projectSuspensionType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.ProjectSuspension,
        )!;

        const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForProjectSuspensionDto;
        const startDate = DateTime.local().plus({ years: 1 }).startOf("month").toJSDate();
        const endDate = DateTime.local().plus({ years: 2 }).endOf("month").toJSDate();
        item.suspensionStartDate = startDate;
        item.suspensionEndDate = endDate;

        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );

        const updated = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const updatedItem = updated.items[0] as PCRItemForProjectSuspensionDto;
        await expect(updatedItem.suspensionStartDate!.toISOString()).toEqual(startDate.toISOString());
        await expect(updatedItem.suspensionEndDate!.toISOString()).toEqual(endDate.toISOString());
      });
    });

    describe("Account Name Change", () => {
      test("returns bad request if partnerId and account name are not sent", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const projectSuspensionType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.AccountNameChange,
        )!;

        const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForAccountNameChangeDto;

        item.accountName = null;
        item.partnerId = partner.id;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.accountName = "New Name Goes Here";
        item.partnerId = null;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.accountName = "New Name Goes Here";
        item.partnerId = partner.id;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );
      });

      test("returns bad request if partner does not belong to project", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const projectPartner = context.testData.createPartner(project);
        const otherPartner = context.testData.createPartner();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const projectSuspensionType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.AccountNameChange,
        )!;

        const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForAccountNameChangeDto;

        item.accountName = "New Name Goes Here";
        item.partnerId = otherPartner.id;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.accountName = "New Name Goes Here";
        item.partnerId = projectPartner.id;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );
      });

      test("updates account name and partner", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const accountNameChangeType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.AccountNameChange,
        )!;

        const recordType = recordTypes.find(x => x.type === accountNameChangeType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForAccountNameChangeDto;

        item.accountName = "New Name Goes Here";
        item.partnerId = partner.id;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );

        const updated = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
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

        const accountNameChangeType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.AccountNameChange,
        )!;
        const recordType = context.testData.createPCRRecordTypes().find(x => x.type === accountNameChangeType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.ToDo });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForAccountNameChangeDto;
        item.partnerId = partner.id;
        item.accountName = "New account name";

        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );

        partner.participantStatus = "Involuntary Withdrawal";

        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);
      });
    });

    describe("Partner withdrawal", () => {
      test("returns a bad request if partnerId and removal period are not sent", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const partnerWithdrawalType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.PartnerWithdrawal,
        )!;

        const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

        item.removalPeriod = null;
        item.partnerId = partner.id;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.removalPeriod = 1;
        item.partnerId = null;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.removalPeriod = 1;
        item.partnerId = partner.id;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );
      });

      test("returns a bad request if partner does not belong to project", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const projectPartner = context.testData.createPartner(project);
        const otherPartner = context.testData.createPartner();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const partnerWithdrawalType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.PartnerWithdrawal,
        )!;

        const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

        item.removalPeriod = 1;
        item.partnerId = otherPartner.id;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.removalPeriod = 1;
        item.partnerId = projectPartner.id;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );
      });

      test("returns a bad request if an invalid removal period is sent", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const partnerWithdrawalType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.PartnerWithdrawal,
        )!;

        const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

        item.removalPeriod = 1.5;
        item.partnerId = partner.id;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.removalPeriod = 1;
        item.partnerId = partner.id;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );
      });

      test("returns a bad request if removal period greater than project periods", async () => {
        const context = new TestContext();

        const project = context.testData.createProject(x => {
          x.Acc_StartDate__c = "2020-01-01";
          x.Acc_ClaimFrequency__c = "Monthly";
        });
        const partner = context.testData.createPartner(project);
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const partnerWithdrawalType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.PartnerWithdrawal,
        )!;

        const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

        item.removalPeriod = 6;
        item.partnerId = partner.id;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.removalPeriod = 1;
        item.partnerId = partner.id;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );
      });

      test("updates removal period and partner", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const partnerWithdrawalType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.PartnerWithdrawal,
        )!;

        const recordType = recordTypes.find(x => x.type === partnerWithdrawalType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;

        item.removalPeriod = 1;
        item.partnerId = partner.id;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );

        const update = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const updateItem = update.items[0] as PCRItemForPartnerWithdrawalDto;
        await expect(updateItem.removalPeriod).toEqual(1);
        await expect(updateItem.partnerId).toBe(partner.id);
      });

      test("cannot withdraw withdrawn partner", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });

        context.testData.createCurrentUserAsProjectManager(project);

        const partnerWithdrawalType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.PartnerWithdrawal,
        )!;
        const recordType = context.testData.createPCRRecordTypes().find(x => x.type === partnerWithdrawalType.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.ToDo });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForPartnerWithdrawalDto;
        item.removalPeriod = 1;
        item.partnerId = partner.id;
        item.status = PCRItemStatus.Complete;

        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );

        partner.participantStatus = "Involuntary Withdrawal";

        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);
      });
    });

    describe("PCR Multiple partner virement", () => {
      test("Grant carried over financial year field gets created, validated, and updated properly", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const multiplePartnerFinancialVirement = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.MultiplePartnerFinancialVirement,
        )!;

        const recordType = recordTypes.find(x => x.type === multiplePartnerFinancialVirement.typeName);
        context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(
          new GetPCRByIdQuery(projectChangeRequest.projectId, projectChangeRequest.id),
        );
        const item = dto.items[0] as PCRItemForMultiplePartnerFinancialVirementDto;

        item.grantMovingOverFinancialYear = -1;
        await expect(
          context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto)),
        ).rejects.toThrow(ValidationError);

        item.grantMovingOverFinancialYear = 100;
        await expect(context.runCommand(new UpdatePCRCommand(project.Id, projectChangeRequest.id, dto))).resolves.toBe(
          true,
        );
      });
    });

    describe("Loan Drawdown Extension", () => {
      const loanExtensionSetup = async () => {
        const context = new TestContext();

        const project = context.testData.createProject(x => (x.Acc_CompetitionType__c = "LOANS"));
        context.testData.createCurrentUserAsProjectManager(project);
        const pcr = context.testData.createPCR(project, { status: PCRStatus.Draft });
        const recordTypes = context.testData.createPCRRecordTypes();

        const loanExtensionType = GetPCRItemTypesQuery.recordTypeMetaValues.find(
          x => x.type === PCRItemType.LoanDrawdownExtension,
        );
        const recordType = recordTypes.find(x => x.type === loanExtensionType!.typeName);

        context.testData.createPCRItem(pcr, recordType, { status: PCRItemStatus.Complete });

        const dto = await context.runQuery(new GetPCRByIdQuery(pcr.projectId, pcr.id));

        /**
         * @description A simple util that takes the current data and provides a simple way of changing stub data.
         * @example
         * const stubData = createStubItems(currentItems => [
         *   {...currentItems[0], key: "first-item-custom-value" },
         *   {...currentItems[1], key: "second-item-custom-value" }
         * ])
         */
        const createStubItems = (
          createNewItems: (currentState: PCRItemForLoanDrawdownExtensionDto[]) => PCRItemForLoanDrawdownExtensionDto[],
        ): PCRDto => ({ ...dto, items: createNewItems(dto.items as PCRItemForLoanDrawdownExtensionDto[]) });

        return {
          context,
          project,
          pcr,
          createStubItems,
        };
      };

      describe("with valid requests", () => {
        describe("with availabilityPeriod", () => {
          test("when increased", async () => {
            const { context, project, pcr, createStubItems } = await loanExtensionSetup();

            const stubPayload = createStubItems(currentItems => [
              {
                ...currentItems[0],
                projectStartDate: new Date(Date.UTC(2022, 0, 1)),
                availabilityPeriod: 3,
                availabilityPeriodChange: 6,
                extensionPeriod: 3,
                extensionPeriodChange: 3,
                repaymentPeriod: 3,
                repaymentPeriodChange: 3,
              },
            ]);

            await expect(
              context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, stubPayload)),
            ).resolves.toBeTruthy();
          });

          test("when decreased", async () => {
            const { context, project, pcr, createStubItems } = await loanExtensionSetup();

            const stubPayload = createStubItems(currentItems => [
              {
                ...currentItems[0],
                projectStartDate: new Date(Date.UTC(2022, 0, 1)),
                availabilityPeriod: 9,
                availabilityPeriodChange: 6,
                extensionPeriod: 3,
                extensionPeriodChange: 3,
                repaymentPeriod: 3,
                repaymentPeriodChange: 3,
              },
            ]);

            await expect(
              context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, stubPayload)),
            ).resolves.toBeTruthy();
          });
        });

        describe("with extensionPeriod", () => {
          test("when increased", async () => {
            const { context, project, pcr, createStubItems } = await loanExtensionSetup();

            const stubPayload = createStubItems(currentItems => [
              {
                ...currentItems[0],
                projectStartDate: new Date(Date.UTC(2022, 0, 1)),
                availabilityPeriod: 3,
                availabilityPeriodChange: 3,
                extensionPeriod: 3,
                extensionPeriodChange: 6,
                repaymentPeriod: 3,
                repaymentPeriodChange: 3,
              },
            ]);

            await expect(
              context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, stubPayload)),
            ).resolves.toBeTruthy();
          });

          test("when decreased", async () => {
            const { context, project, pcr, createStubItems } = await loanExtensionSetup();

            const stubPayload = createStubItems(currentItems => [
              {
                ...currentItems[0],
                projectStartDate: new Date(Date.UTC(2022, 0, 1)),
                availabilityPeriod: 3,
                availabilityPeriodChange: 3,
                extensionPeriod: 9,
                extensionPeriodChange: 6,
                repaymentPeriod: 3,
                repaymentPeriodChange: 3,
              },
            ]);

            await expect(
              context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, stubPayload)),
            ).resolves.toBeTruthy();
          });
        });

        describe("with repaymentPeriod", () => {
          test("when increased", async () => {
            const { context, project, pcr, createStubItems } = await loanExtensionSetup();

            const stubPayload = createStubItems(currentItems => [
              {
                ...currentItems[0],
                projectStartDate: new Date(Date.UTC(2022, 0, 1)),
                availabilityPeriod: 3,
                availabilityPeriodChange: 3,
                extensionPeriod: 3,
                extensionPeriodChange: 3,
                repaymentPeriod: 3,
                repaymentPeriodChange: 6,
              },
            ]);

            await expect(
              context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, stubPayload)),
            ).resolves.toBeTruthy();
          });

          test("when decreased", async () => {
            const { context, project, pcr, createStubItems } = await loanExtensionSetup();

            const stubPayload = createStubItems(currentItems => [
              {
                ...currentItems[0],
                projectStartDate: new Date(Date.UTC(2022, 0, 1)),
                availabilityPeriod: 3,
                availabilityPeriodChange: 3,
                extensionPeriod: 3,
                extensionPeriodChange: 3,
                repaymentPeriod: 9,
                repaymentPeriodChange: 6,
              },
            ]);

            await expect(
              context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, stubPayload)),
            ).resolves.toBeTruthy();
          });
        });
      });

      test("when no changes are made throw an error", async () => {
        const { context, project, pcr, createStubItems } = await loanExtensionSetup();

        const stubPayload = createStubItems(currentItems => [
          {
            ...currentItems[0],
            projectStartDate: new Date(Date.UTC(2022, 0, 1)),
            availabilityPeriod: 3,
            availabilityPeriodChange: 3,
            extensionPeriod: 3,
            extensionPeriodChange: 3,
            repaymentPeriod: 3,
            repaymentPeriodChange: 3,
          },
        ]);

        await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, stubPayload))).rejects.toThrow(
          ValidationError,
        );
      });

      test("when changed value is not divisible in quarters", async () => {
        const { context, project, pcr, createStubItems } = await loanExtensionSetup();

        const inValidNumberNotQuarter = 5;

        const stubPayload = createStubItems(currentItems => [
          {
            ...currentItems[0],
            projectStartDate: new Date(Date.UTC(2022, 0, 1)),
            availabilityPeriod: 3,
            availabilityPeriodChange: inValidNumberNotQuarter,
            extensionPeriod: 3,
            extensionPeriodChange: 3,
            repaymentPeriod: 3,
            repaymentPeriodChange: 3,
          },
        ]);

        await expect(context.runCommand(new UpdatePCRCommand(project.Id, pcr.id, stubPayload))).rejects.toThrow(
          ValidationError,
        );
      });
    });
  });
});
