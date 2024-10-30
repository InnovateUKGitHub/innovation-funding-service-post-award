import { ProjectDto } from "@framework/dtos/projectDto";
import { IContext } from "@framework/types/IContext";
import { mapToProjectDto } from "@server/features/projects/mapToProjectDto";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetAllProjectRolesForUser } from "./getAllProjectRolesForUser";

export class GetByIdQuery extends AuthorisedAsyncQueryBase<ProjectDto> {
  public readonly runnableName: string = "GetByIdQuery";
  constructor(private readonly projectId: ProjectId) {
    super();
  }

  async run(context: IContext) {
    const item = await context.repositories.projects.getById(this.projectId);
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const roleInfo = roles.forProject(this.projectId).getRoles();
    return mapToProjectDto(context, item, roleInfo);
  }
}
