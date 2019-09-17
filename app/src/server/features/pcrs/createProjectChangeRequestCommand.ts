import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { PCRDto, PCRItemTypeDto, ProjectRole } from "@framework/dtos";
import { Authorisation, IContext } from "@framework/types";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { ProjectChangeRequestDtoValidatorForCreate } from "@ui/validators/projectChangeRequestDtoValidatorForCreate";
import { GetAllForProjectQuery } from "@server/features/partners";

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
    return context.repositories.pcrs.createProjectChangeRequest({
      projectId: projectChangeRequestDto.projectId,
      reasoningStatus: projectChangeRequestDto.reasoningStatus,
      status: projectChangeRequestDto.status,
      items: projectChangeRequestDto.items.map(x => ({
        projectId: projectChangeRequestDto.projectId,
        recordTypeId: itemTypes.find(t => t.type === x.type)!.recordTypeId,
        status: x.status
      }))
    });
  }

  protected async Run(context: IContext) {

    if (this.projectChangeRequestDto.id) {
      throw new BadRequestError("Project change request has already been created");
    }

    if (this.projectChangeRequestDto.projectId !== this.projectId) {
      throw new BadRequestError("Project type does not match change request project type");
    }
    // @TODO remove this hack when projectId field is added to project change request object in SF
    const partner = await context.runQuery(new GetAllForProjectQuery(this.projectId));
    this.projectChangeRequestDto.projectId = partner[0].id;
    //

    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery());
    const validationResult = new ProjectChangeRequestDtoValidatorForCreate(this.projectChangeRequestDto, itemTypes,true);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    return this.insertProjectChangeRequest(context, this.projectChangeRequestDto, itemTypes);
  }
}
