import { IContext, QueryBase } from "../common/context";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto } from "../../../types";
import { GetAllProjectRolesForUser, getEmptyRoleInfo } from "./getAllProjectRolesForUser";

export class GetByIdQuery extends QueryBase<ProjectDto> {
  constructor(readonly id: string) {
    super();
  }

  async Run(context: IContext) {
    const item = await context.repositories.projects.getById(this.id);
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const roleInfo = roles.getProjectRoles(this.id);
    return context.runCommand(new MapToProjectDtoCommand(item, roleInfo));
  }
}
