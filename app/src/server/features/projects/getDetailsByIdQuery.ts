import { IContext, ProjectDto } from "@framework/types";
import { mapToProjectDto } from "@server/features/projects/mapToProjectDto";
import { QueryBase } from "../common";
import { GetAllProjectRolesForUser } from "./getAllProjectRolesForUser";

export class GetByIdQuery extends QueryBase<ProjectDto> {
  constructor(private readonly projectId: string) {
    super();
  }

  async run(context: IContext) {
    const item = await context.repositories.projects.getById(this.projectId);
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const roleInfo = roles.forProject(this.projectId).getRoles();
    return mapToProjectDto(context, item, roleInfo);
  }
}
