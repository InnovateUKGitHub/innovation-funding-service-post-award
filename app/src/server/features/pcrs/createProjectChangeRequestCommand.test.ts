import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { PCRDto, PCRItemDto } from "@framework/dtos";
import { ValidationError } from "@server/features/common";
import { Authorisation } from "@framework/types";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { PCRItemStatus, PCRItemType, PCRStatus, ProjectRole } from "@framework/constants";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("Create PCR Command", () => {
  describe("with PCR Items based from existing PCR's", () => {
    describe("should throw a validation error with existing PCRs", () => {
      const setupExistingPcrItemTestBed = (pcrItemsToCheck: PCRItemType[]) => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        const allRecordTypes = context.testData.createPCRRecordTypes();

        context.testData.createCurrentUserAsProjectManager(project);

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
          pcrItems,
        };
      };

      test("when a singular PCR Item already in progress", async () => {
        const itemTypeToCreate = [PCRItemType.ScopeChange];
        const { context, project, pcrItems } = setupExistingPcrItemTestBed(itemTypeToCreate);

        if (pcrItems.length !== itemTypeToCreate.length) {
          throw new Error(
            `It appears there are not enough test data to preform this test. You should have total item count of "${itemTypeToCreate.length}".`,
          );
        }

        const pcrPayload = {
          projectId: project.Id,
          status: PCRStatus.Draft,
          reasoningStatus: PCRItemStatus.ToDo,
          items: pcrItems,
        } as PCRDto;

        const command = new CreateProjectChangeRequestCommand(project.Id, pcrPayload);

        await expect(context.runCommand(command)).rejects.toThrowError(ValidationError);
      });

      test("when a multiple PCR Items are already in progress", async () => {
        const itemTypesToCreate = [PCRItemType.ScopeChange, PCRItemType.TimeExtension];
        const { context, project, pcrItems } = setupExistingPcrItemTestBed(itemTypesToCreate);

        if (pcrItems.length !== itemTypesToCreate.length) {
          throw new Error(
            `It appears there are not enough test data to preform this test. You should have total item count of "${itemTypesToCreate.length}".`,
          );
        }

        const pcrPayload = {
          projectId: project.Id,
          status: PCRStatus.Draft,
          reasoningStatus: PCRItemStatus.ToDo,
          items: pcrItems,
        } as PCRDto;

        const command = new CreateProjectChangeRequestCommand(project.Id, pcrPayload);

        await expect(context.runCommand(command)).rejects.toThrowError(ValidationError);
      });
    });
  });

  test("should throw a validation error if no items are added", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    await context.testData.createPartner(project);
    const command = new CreateProjectChangeRequestCommand(project.Id, ({
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
    } as any) as PCRDto);

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  test("should throw a validation error if the reasoning status is not To Do", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    await context.testData.createPartner(project);
    const command = new CreateProjectChangeRequestCommand(project.Id, ({
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.Complete,
    } as any) as PCRDto);

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  test("should throw a validation error if the status is not Draft", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    await context.testData.createPartner(project);
    const command = new CreateProjectChangeRequestCommand(project.Id, ({
      projectId: project.Id,
      status: PCRStatus.Approved,
      reasoningStatus: PCRItemStatus.ToDo,
    } as any) as PCRDto);

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  test("returns a validation error if a type is not enabled", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    context.testData.createCurrentUserAsProjectManager(project);
    const partner = context.testData.createPartner(project);

    const command = new CreateProjectChangeRequestCommand(project.Id, ({
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [
        {
          // TODO: This code needs to be refactored
          // Note: This find query will never work since we have remove all matching competitions
          // type: GetPCRItemTypesQuery.recordTypeMetaValues.find(x => x.type === PCRItemType.SinglePartnerFinancialVirement),
          type: PCRItemType.SinglePartnerFinancialVirement,
          status: PCRItemStatus.ToDo,
          accountName: "Pocahontas",
          partnerId: partner.id,
        },
      ],
    } as any) as PCRDto);

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  test("should add a new project change request to the repo", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    context.testData.createCurrentUserAsProjectManager(project);
    const partner = context.testData.createPartner(project);
    const recordTypes = context.testData.createPCRRecordTypes();

    const itemType = GetPCRItemTypesQuery.recordTypeMetaValues.find(x => x.type === PCRItemType.AccountNameChange)!;

    const command = new CreateProjectChangeRequestCommand(project.Id, ({
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [
        {
          type: itemType.type,
          status: PCRItemStatus.ToDo,
          accountName: "Frida",
          partnerId: partner.id,
        },
      ],
    } as any) as PCRDto);

    const id = await context.runCommand(command);
    const newPCR = context.repositories.projectChangeRequests.Items.find(x => x.id === id)!;
    expect(newPCR).toBeDefined();
    expect(newPCR.items).toHaveLength(1);
    expect(newPCR).toEqual({
      id,
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [
        {
          status: PCRItemStatus.ToDo,
          projectId: project.Id,
          partnerId: partner.id,
          accountName: "Frida",
          recordTypeId: recordTypes.find(x => x.type === itemType.typeName)!.id,
        },
      ],
    });
  });
  test("accessControl - Project Manager passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    await context.testData.createPartner(project);
    const recordTypes = context.testData.createPCRRecordTypes();
    const command = new CreateProjectChangeRequestCommand(project.Id, ({
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [
        {
          type: recordTypes[0].type,
          status: PCRItemStatus.ToDo,
          recordTypeId: recordTypes[0].id,
        },
      ],
    } as any) as PCRDto);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.ProjectManager,
        partnerRoles: {},
      },
    });
    expect(await context.runAccessControl(auth, command)).toBe(true);
  });
  test("accessControl - Everyone else fails", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = await context.testData.createPartner(project);
    const recordTypes = context.testData.createPCRRecordTypes();
    const command = new CreateProjectChangeRequestCommand(project.Id, ({
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [
        {
          type: recordTypes[0].type,
          status: PCRItemStatus.ToDo,
          recordTypeId: recordTypes[0].id,
        },
      ],
    } as any) as PCRDto);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.Unknown,
        partnerRoles: {
          [partner.id]: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.Unknown,
        },
      },
    });
    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
