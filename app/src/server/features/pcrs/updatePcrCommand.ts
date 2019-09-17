import { BadRequestError, CommandBase, ValidationError } from "../common";
import { PCRDto, ProjectRole } from "@framework/dtos";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Authorisation, IContext } from "@framework/types";
import { GetAllProjectRolesForUser } from "../projects";
import { mapToPcrDto } from "./mapToPCRDto";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";
import { ProjectChangeRequestItemForCreateEntity } from "@framework/entities";
import { GetAllForProjectQuery } from "@server/features/partners";

export class UpdatePCRCommand extends CommandBase<boolean> {
  constructor(private projectId: string, private id: string, private pcr: PCRDto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<boolean> {
    if (this.projectId !== this.pcr.projectId || this.id !== this.pcr.id) {
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
      }));

    if (itemsToInsert.length) {
      // @TODO remove this hack when projectId field is added to project change request object in SF
      const partner = await context.runQuery(new GetAllForProjectQuery(this.projectId));
      itemsToInsert.forEach(x => x.projectId = partner[0].id);
      //
      await context.repositories.projectChangeRequests.insertItems(this.id, itemsToInsert);
    }

    return true;
  }
}
