import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { PCRDto, PCRItemDto, PCRItemTypeDto, ProjectRole } from "@framework/dtos";
import { Authorisation, IContext } from "@framework/types";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { ProjectChangeRequestItemForCreateEntity } from "@framework/entities";
import { PCRDtoValidator } from "@ui/validators";
import { GetAllProjectRolesForUser } from "@server/features/projects";
import { PCRItemType } from "@framework/constants";

export class CreateProjectChangeRequestCommand extends CommandBase<string> {
  constructor(
    private readonly projectId: string,
    private readonly projectChangeRequestDto: PCRDto
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
  }

  private async insertProjectChangeRequest(context: IContext, projectChangeRequestDto: PCRDto, itemTypes: PCRItemTypeDto[]): Promise<string> {
    return context.repositories.projectChangeRequests.createProjectChangeRequest({
      projectId: projectChangeRequestDto.projectId,
      reasoningStatus: projectChangeRequestDto.reasoningStatus,
      status: projectChangeRequestDto.status,
      items: projectChangeRequestDto.items.map(x => this.mapItem(projectChangeRequestDto, x, itemTypes))
    });
  }

  private async insertStatusChange(context: IContext, projectChangeRequestId: string): Promise<void> {
    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: projectChangeRequestId,
      Acc_ExternalComment__c: "",
      Acc_ParticipantVisibility__c: true,
    });
  }

  protected async Run(context: IContext) {

    if (this.projectChangeRequestDto.id) {
      throw new BadRequestError("Project change request has already been created");
    }

    if (this.projectChangeRequestDto.projectId !== this.projectId) {
      throw new BadRequestError("Project type does not match change request project type");
    }

    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery());
    const projectRoles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(this.projectId).getRoles());
    const validationResult = new PCRDtoValidator(this.projectChangeRequestDto, projectRoles, itemTypes,true);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const projectChangeRequestId = await this.insertProjectChangeRequest(context, this.projectChangeRequestDto, itemTypes);
    await this.insertStatusChange(context, projectChangeRequestId);
    return projectChangeRequestId;
  }

  private mapItem(dto: PCRDto, itemDto: PCRItemDto, itemTypes: PCRItemTypeDto[]): ProjectChangeRequestItemForCreateEntity {
    const init = {
      projectId: dto.projectId,
      recordTypeId: itemTypes.find(t => t.type === itemDto.type)!.recordTypeId,
      status: itemDto.status
    };
    switch (itemDto.type) {
      case PCRItemType.TimeExtension:
          return { ...init, projectDuration: itemDto.projectDuration };
      case PCRItemType.ScopeChange:
          return { ...init, projectSummary: itemDto.projectSummary, publicDescription: itemDto.publicDescription };
      case PCRItemType.ProjectSuspension:
          return { ...init, suspensionStartDate: itemDto.suspensionStartDate, suspensionEndDate: itemDto.suspensionEndDate };
      case PCRItemType.AccountNameChange:
          return { ...init, accountName: itemDto.accountName, partnerId: itemDto.partnerId };
      default:
        return init;
    }
  }
}
