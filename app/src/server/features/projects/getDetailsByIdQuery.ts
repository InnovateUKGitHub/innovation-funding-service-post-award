import { QueryBase } from "../common";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { GetAllProjectRolesForUser } from "./getAllProjectRolesForUser";
import { IContext, ProjectDto } from "../../../types";

export class GetByIdQuery extends QueryBase<ProjectDto> {
  constructor(private readonly projectId: string) {
    super();
  }

  async Run(context: IContext) {
    const item = await context.repositories.projects.getById(this.projectId);
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const roleInfo = roles.forProject(this.projectId).getRoles();
    return context.runCommand(new MapToProjectDtoCommand(item, roleInfo));
  }
}
