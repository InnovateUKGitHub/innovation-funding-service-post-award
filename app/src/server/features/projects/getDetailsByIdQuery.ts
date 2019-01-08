import { IContext, QueryBase } from "../common/context";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto } from "../../../types";
import { GetProjectRolesForUser } from "./getProjectRolesForUser";

export class GetByIdQuery extends QueryBase<ProjectDto> {
  constructor(readonly id: string) {
    super();
  }

  async Run(context: IContext) {
    const item = await context.repositories.projects.getById(this.id);
    const roles = await context.runQuery(new GetProjectRolesForUser(this.id));
    return await context.runCommand(new MapToProjectDtoCommand(item, roles));
  }
}
