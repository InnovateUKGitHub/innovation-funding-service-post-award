import { BadRequestError, CommandBase, ValidationError } from "../common";
import { PCRDto, ProjectRole } from "@framework/dtos";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Authorisation, IContext } from "@framework/types";
import { GetAllProjectRolesForUser } from "../projects";
import { mapToPcrDto } from "./mapToPCRDto";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";

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

    const original = await context.repositories.pcrs.getById(this.pcr.projectId, this.pcr.id);

    const originalDto = mapToPcrDto(original, itemTypes);

    const validationResult = new PCRDtoValidator(this.pcr, projectRoles, originalDto, true);

    if (!validationResult.isValid) {

      throw new ValidationError(validationResult);
    }

    original.comments = this.pcr.comments;
    original.status = this.pcr.status;
    original.reasoning = this.pcr.reasoningComments;
    original.reasoningStatus = this.pcr.reasoningStatus;

    await context.repositories.pcrs.updatePcr(original);

    return true;
  }
}
