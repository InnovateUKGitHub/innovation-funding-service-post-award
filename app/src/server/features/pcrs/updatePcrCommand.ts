import { BadRequestError, CommandBase, ValidationError } from "../common";
import {
  PCRDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRStandardItemDto,
  ProjectRole, TypedPcrItemDto
} from "@framework/dtos";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Authorisation, IContext } from "@framework/types";
import { GetAllProjectRolesForUser } from "../projects";
import { mapToPcrDto } from "./mapToPCRDto";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";
import {
  ProjectChangeRequestItemEntity,
  ProjectChangeRequestItemForCreateEntity,
  ProjectChangeRequestItemTypeEntity,
  ProjectChangeRequestStatus
} from "@framework/entities";

export class UpdatePCRCommand extends CommandBase<boolean> {
  constructor(private projectId: string, private projectChangeRequestId: string, private pcr: PCRDto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  private async insertStatusChange(context: IContext, projectChangeRequestId: string, comments: string, originalStatus: ProjectChangeRequestStatus, newStatus: ProjectChangeRequestStatus): Promise<void> {
    const shouldPmSee = (
      (newStatus === ProjectChangeRequestStatus.SubmittedToMonitoringOfficer)
      || (newStatus === ProjectChangeRequestStatus.QueriedByMonitoringOfficer)
      || (newStatus === ProjectChangeRequestStatus.SubmittedToInnovationLead && originalStatus === ProjectChangeRequestStatus.QueriedByInnovateUK)
    );

    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: projectChangeRequestId,
      Acc_ExternalComment__c: comments,
      Acc_ParticipantVisibility__c: shouldPmSee
    });
  }

  protected async Run(context: IContext): Promise<boolean> {
    if (this.projectId !== this.pcr.projectId || this.projectChangeRequestId !== this.pcr.id) {
      throw new BadRequestError();
    }

    const projectRoles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(this.projectId).getRoles());
    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery());

    const entityToUpdate = await context.repositories.projectChangeRequests.getById(this.pcr.projectId, this.pcr.id);

    const originalDto = mapToPcrDto(entityToUpdate, itemTypes);

    const validationResult = new PCRDtoValidator(this.pcr, projectRoles, originalDto, itemTypes, true);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    if (entityToUpdate.status !== this.pcr.status) {
      await this.insertStatusChange(context, this.projectChangeRequestId, this.pcr.comments, entityToUpdate.status, this.pcr.status);
      entityToUpdate.comments = "";
    } else  {
      entityToUpdate.comments = this.pcr.comments;
    }

    entityToUpdate.status = this.pcr.status;
    entityToUpdate.reasoning = this.pcr.reasoningComments;
    entityToUpdate.reasoningStatus = this.pcr.reasoningStatus;

    await context.repositories.projectChangeRequests.updateProjectChangeRequest(entityToUpdate);

    const paired = this.pcr.items.map(item => ({
      item,
      originalItem: entityToUpdate.items.find(x => x.id === item.id)
    }));

    const itemsToUpdate = paired
      // exclude new items
      .filter(x => !!x.originalItem)
      // get any updates
      .map(x => this.getItemUpdates(x.originalItem!, x.item))
      // filter those that need updating
      .filter(x => x.hasChanged)
      // get the new item
      .map(x => x.result)
      ;

    if (itemsToUpdate.length) {
      await context.repositories.projectChangeRequests.updateItems(entityToUpdate, itemsToUpdate);
    }

    const itemsToInsert: ProjectChangeRequestItemForCreateEntity[] = paired
      .filter(x => !x.originalItem)
      .map(x => ({
        recordTypeId: itemTypes.find(t => t.type === x.item.type)!.recordTypeId,
        status: x.item.status,
        projectId: this.projectId,
        partnerId: entityToUpdate.partnerId,
      }));

    if (itemsToInsert.length) {
      await context.repositories.projectChangeRequests.insertItems(this.projectChangeRequestId, itemsToInsert);
    }

    return true;
  }

  private getItemUpdates(item: ProjectChangeRequestItemEntity, dto: (TypedPcrItemDto)): { result: ProjectChangeRequestItemEntity, hasChanged: boolean } {
    let hasChanged = false;
    const result = { ...item };

    if (result.status !== dto.status) {
      result.status = dto.status;
      hasChanged = true;
    }

    if (dto.type === ProjectChangeRequestItemTypeEntity.TimeExtension) {
      if (result.projectEndDate !== dto.projectEndDate) {
        result.projectEndDate = dto.projectEndDate;
        hasChanged = true;
      }
    } else if (dto.type === ProjectChangeRequestItemTypeEntity.ScopeChange) {
      if (result.projectSummary !== dto.projectSummary || result.publicDescription !== dto.publicDescription) {
        result.projectSummary = dto.projectSummary;
        result.publicDescription = dto.publicDescription;
        hasChanged = true;
      }
    } else if (dto.type === ProjectChangeRequestItemTypeEntity.ProjectSuspension) {
      if (result.suspensionStartDate !== dto.suspensionStartDate || result.suspensionEndDate !== dto.suspensionEndDate) {
        result.suspensionStartDate = dto.suspensionStartDate;
        result.suspensionEndDate = dto.suspensionEndDate;
        hasChanged = true;
      }
    }

    return { hasChanged, result };
  }
}
