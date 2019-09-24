import { BadRequestError, CommandBase, ValidationError } from "../common";
import { PCRDto, ProjectRole } from "@framework/dtos";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Authorisation, IContext } from "@framework/types";
import { GetAllProjectRolesForUser } from "../projects";
import { mapToPcrDto } from "./mapToPCRDto";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";
import { ProjectChangeRequestItemForCreateEntity, ProjectChangeRequestStatus } from "@framework/entities";

export class UpdatePCRCommand extends CommandBase<boolean> {
  constructor(private projectId: string, private projectChangeRequestId: string, private pcr: PCRDto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  private async insertStatusChange(context: IContext, projectChangeRequestId: string): Promise<void> {
    if (this.pcr.status === ProjectChangeRequestStatus.Draft) return;

    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: projectChangeRequestId
    });
  }

  protected async Run(context: IContext): Promise<boolean> {
    if (this.projectId !== this.pcr.projectId || this.projectChangeRequestId !== this.pcr.id) {
      throw new BadRequestError();
    }

    const projectRoles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(this.projectId).getRoles());
    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery());

    const original = await context.repositories.projectChangeRequests.getById(this.pcr.projectId, this.pcr.id);

    const originalDto = mapToPcrDto(original, itemTypes);

    const validationResult = new PCRDtoValidator(this.pcr, projectRoles, originalDto, itemTypes, true);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    original.comments = this.pcr.comments;
    original.status = this.pcr.status;
    original.reasoning = this.pcr.reasoningComments;
    original.reasoningStatus = this.pcr.reasoningStatus;

    await context.repositories.projectChangeRequests.updateProjectChangeRequest(original);

    const paired = this.pcr.items.map(item => ({
      item,
      originalItem: original.items.find(x => x.id === item.id)
    }));

    const itemsToUpdate = paired
      // exclude new items
        .filter(x => !!x.originalItem)
        // sort out typeings as filter dosnt remove undefined from types
        .map(x => ({
          item: x.item,
          originalItem: x.originalItem!
        }))
        // filter those that need updating
        .filter(x => x.item.status !== x.originalItem.status)
        // update the status
        .map(x => ({ ...x.originalItem, status: x.item.status }))
    ;

    if (itemsToUpdate.length) {
      await context.repositories.projectChangeRequests.updateItems(original, itemsToUpdate);
    }

    const itemsToInsert: ProjectChangeRequestItemForCreateEntity[] = paired
      .filter(x => !x.originalItem)
      .map(x => ({
        recordTypeId: itemTypes.find(t => t.type === x.item.type)!.recordTypeId,
        status: x.item.status,
        projectId: this.projectId,
        partnerId: original.partnerId,
      }));

    if (itemsToInsert.length) {
      await context.repositories.projectChangeRequests.insertItems(this.projectChangeRequestId, itemsToInsert);
    }

    await this.insertStatusChange(context, this.projectChangeRequestId);
    return true;
  }
}
