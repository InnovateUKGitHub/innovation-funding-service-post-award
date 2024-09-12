/* eslint-disable @typescript-eslint/naming-convention */

import { GetAvailableItemTypesQuery } from "./getAvailableItemTypesQuery";
import { GetAllPCRsQuery } from "./getAllPCRsQuery";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PCRDto, PCRItemTypeDto, CreatePcrDto, CreatePcrItemDto } from "@framework/dtos/pcrDtos";
import { ProjectChangeRequestItemForCreateEntity } from "@framework/entities/projectChangeRequest";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { BadRequestError, ValidationError } from "../common/appError";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { GetAllForProjectQuery } from "../partners/getAllForProjectQuery";
import { getMapper } from "./mapToPCRDto";

export class CreateProjectChangeRequestCommand extends AuthorisedAsyncCommandBase<PcrId> {
  public readonly runnableName: string = "CreateProjectChangeRequestCommand";
  constructor(
    private readonly projectId: ProjectId,
    private readonly projectChangeRequestDto: CreatePcrDto,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.ProjectManager);
  }

  private async insertProjectChangeRequest(
    context: IContext,
    projectChangeRequestDto: CreatePcrDto,
    itemTypes: PCRItemTypeDto[],
  ): Promise<PcrId> {
    const newPCR = {
      projectId: projectChangeRequestDto.projectId,
      reasoningStatus: projectChangeRequestDto.reasoningStatus,
      status: projectChangeRequestDto.status,
      manageTeamMemberStatus: projectChangeRequestDto.manageTeamMemberStatus,
      items: projectChangeRequestDto.items.map(x => this.mapItem(projectChangeRequestDto, x, itemTypes)),
    };

    return context.repositories.projectChangeRequests.createProjectChangeRequest(newPCR);
  }

  private async insertStatusChange(context: IContext, projectChangeRequestId: string): Promise<string> {
    const pcrToBeChanged = {
      Acc_ProjectChangeRequest__c: projectChangeRequestId,
      Acc_ExternalComment__c: "",
      Acc_ParticipantVisibility__c: true,
    };

    return await context.repositories.projectChangeRequestStatusChange.createStatusChange(pcrToBeChanged);
  }

  protected async run(context: IContext) {
    if ("id" in this.projectChangeRequestDto) {
      throw new BadRequestError("Project change request has already been created");
    }

    if (this.projectChangeRequestDto.projectId !== this.projectId) {
      throw new BadRequestError("Project type does not match change request project type");
    }

    const itemTypes = await context.runQuery(new GetAvailableItemTypesQuery(this.projectId));
    const projectRoles = await context
      .runQuery(new GetAllProjectRolesForUser())
      .then(x => x.forProject(this.projectId).getRoles());
    const projectDto = await context.runQuery(new GetByIdQuery(this.projectId));
    const partners = await context.runQuery(new GetAllForProjectQuery(this.projectId));
    const projectPcrs = await context.runQuery(new GetAllPCRsQuery(this.projectId));

    const validationResult = new PCRDtoValidator({
      model: this.projectChangeRequestDto as PCRDto,
      role: projectRoles,
      recordTypes: itemTypes,
      showValidationErrors: true,
      project: projectDto,
      original: undefined,
      partners: partners,
      projectPcrs: projectPcrs,
    });

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const projectChangeRequestId = await this.insertProjectChangeRequest(
      context,
      this.projectChangeRequestDto,
      itemTypes,
    );
    await this.insertStatusChange(context, projectChangeRequestId);
    return projectChangeRequestId;
  }

  private mapItem(
    dto: CreatePcrDto,
    itemDto: CreatePcrItemDto,
    itemTypes: PCRItemTypeDto[],
  ): ProjectChangeRequestItemForCreateEntity {
    const matchedItem = itemTypes.find(t => t.type === itemDto.type);
    if (!matchedItem) throw new Error(`cannot find item matching ${itemDto.type}`);
    const mapper = getMapper(itemDto.type);
    return {
      projectId: dto.projectId,
      recordTypeId: matchedItem.recordTypeId,
      developerRecordTypeName: matchedItem.developerRecordTypeName,
      status: itemDto.status,
      ...mapper?.(itemDto),
    };
  }
}
