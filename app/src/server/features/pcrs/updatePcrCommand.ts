import { BadRequestError, CommandBase, ValidationError } from "../common";
import { PCRDto, PCRItemDto, ProjectRole } from "@framework/dtos";
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
import { GetAllForProjectQuery } from "@server/features/partners";

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
    const partners = await context.runQuery(new GetAllForProjectQuery(this.projectId));

    const originalDto = mapToPcrDto(entityToUpdate, itemTypes);

    const validationResult = new PCRDtoValidator(this.pcr, projectRoles, itemTypes, true, originalDto, partners);

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
      .map(x => {
        const updates = this.getItemUpdates(x.originalItem!, x.item);
        return updates ? { ...x.originalItem!, ...updates } : null;
      })
      // filter those that need updating
      .filter(x => !!x)
      .map<ProjectChangeRequestItemEntity>(x => x!)
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
      }));

    if (itemsToInsert.length) {
      await context.repositories.projectChangeRequests.insertItems(this.projectChangeRequestId, itemsToInsert);
    }

    return true;
  }

  private getItemUpdates(item: ProjectChangeRequestItemEntity, dto: (PCRItemDto)): Partial<ProjectChangeRequestItemEntity> | null {

    const init = item.status !== dto.status ? { status: dto.status } : null;

    switch (dto.type) {
      case ProjectChangeRequestItemTypeEntity.TimeExtension:
        if (item.projectEndDate !== dto.projectEndDate) {
          return { ...init, projectEndDate: dto.projectEndDate };
        }
        break;
      case ProjectChangeRequestItemTypeEntity.ScopeChange:
        if (item.projectSummary !== dto.projectSummary || item.publicDescription !== dto.publicDescription) {
          return { ...init, projectSummary: dto.projectSummary, publicDescription: dto.publicDescription };
        }
        break;
      case ProjectChangeRequestItemTypeEntity.ProjectSuspension:
        if (item.suspensionStartDate !== dto.suspensionStartDate || item.suspensionEndDate !== dto.suspensionEndDate) {
          return { ...init, suspensionStartDate: dto.suspensionStartDate, suspensionEndDate: dto.suspensionEndDate };
        }
        break;
      case ProjectChangeRequestItemTypeEntity.AccountNameChange:
        if (item.accountName !== dto.accountName || item.partnerId !== dto.partnerId) {
          return { ...init, accountName: dto.accountName, partnerId: dto.partnerId };
        }
        break;
    }

    return init;
  }
}
