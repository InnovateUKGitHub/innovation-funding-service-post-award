import { QueryBase } from "../common/queryBase";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto } from "../../../types";
import { GetAllProjectRolesForUser } from "./getAllProjectRolesForUser";
import { IContext } from "../../../types/IContext";

export class GetByIdQuery extends QueryBase<ProjectDto> {
  constructor(readonly id: string) {
    super();
  }

  async Run(context: IContext) {
    const item = await context.repositories.projects.getById(this.id);
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const roleInfo = roles.for(this.id).getRoles();
    return context.runCommand(new MapToProjectDtoCommand(item, roleInfo));
  }
}
