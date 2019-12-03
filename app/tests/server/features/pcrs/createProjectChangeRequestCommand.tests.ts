import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { TestContext } from "../../testContextProvider";
import { PCRDto, ProjectRole } from "@framework/dtos";
import { ValidationError } from "@server/features/common";
import { Authorisation } from "@framework/types";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";
import {
  PCRItemStatus,
  PCRItemType,
  PCRStatus
} from "@framework/constants";

describe("Create PCR Command", () => {
  it("should throw a validation error if no items are added", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    await context.testData.createPartner(project);
    const command = new CreateProjectChangeRequestCommand(project.Id, {
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo
    } as any as PCRDto);

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });
  it("should throw a validation error if the reasoning status is not To Do", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    await context.testData.createPartner(project);
    const command = new CreateProjectChangeRequestCommand(project.Id, {
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.Complete
    } as any as PCRDto);

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });
  it("should throw a validation error if the status is not Draft", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    await context.testData.createPartner(project);
    const command = new CreateProjectChangeRequestCommand(project.Id, {
      projectId: project.Id,
      status: PCRStatus.Approved,
      reasoningStatus: PCRItemStatus.ToDo
    } as any as PCRDto);

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });
  it("returns a validation error if a type is not enabled", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    context.testData.createCurrentUserAsProjectManager(project);
    const partner = context.testData.createPartner(project);
    const itemType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.SinglePartnerFinancialVirement)!;

    const command = new CreateProjectChangeRequestCommand(project.Id, {
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [{
        type: itemType.type,
        status: PCRItemStatus.ToDo,
        accountName: "Pocahontas",
        partnerId: partner.Id
      }]
    } as any as PCRDto);

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });
  it("should add a new project change request to the repo", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    context.testData.createCurrentUserAsProjectManager(project);
    const partner = context.testData.createPartner(project);
    const recordTypes = context.testData.createPCRRecordTypes();

    const itemType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.AccountNameChange)!;

    const command = new CreateProjectChangeRequestCommand(project.Id, {
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [{
        type: itemType.type,
        status: PCRItemStatus.ToDo,
        accountName: "Frida",
        partnerId: partner.Id
      }]
    } as any as PCRDto);

    const id = await context.runCommand(command);
    const newPCR = context.repositories.projectChangeRequests.Items.find(x => x.id === id)!;
    expect(newPCR).toBeDefined();
    expect(newPCR.items).toHaveLength(1);
    expect(newPCR).toEqual({
      id,
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [{
        status: PCRItemStatus.ToDo,
        projectId: project.Id,
        partnerId: partner.Id,
        accountName: "Frida",
        recordTypeId: recordTypes.find(x => x.type === itemType.typeName)!.id,
      }]
    });
  });
  test("accessControl - Project Manager passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    await context.testData.createPartner(project);
    const recordTypes = context.testData.createPCRRecordTypes();
    const command = new CreateProjectChangeRequestCommand(project.Id, {
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [{
        type: recordTypes[0].type,
        status: PCRItemStatus.ToDo,
        recordTypeId: recordTypes[0].id
      }]
    } as any as PCRDto);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.ProjectManager,
        partnerRoles: {}
      }
    });
    expect(await context.runAccessControl(auth, command)).toBe(true);
  });
  test("accessControl - Everyone else fails", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = await context.testData.createPartner(project);
    const recordTypes = context.testData.createPCRRecordTypes();
    const command = new CreateProjectChangeRequestCommand(project.Id, {
      projectId: project.Id,
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      items: [{
        type: recordTypes[0].type,
        status: PCRItemStatus.ToDo,
        recordTypeId: recordTypes[0].id
      }]
    } as any as PCRDto);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.Unknown,
        partnerRoles: { [partner.Id]: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.Unknown }
      }
    });
    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
