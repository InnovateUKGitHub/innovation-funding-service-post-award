import { IContext, QueryBase } from "../common/context";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto, ProjectRole } from "../../../types";
import { GetAllProjectRolesForUser, getEmptyRoleInfo } from "./getAllProjectRolesForUser";

export class GetAllQuery extends QueryBase<ProjectDto[]> {
  protected async Run(context: IContext) {
    const items = await context.repositories.projects.getAll();
    const allRoles = await context.runQuery(new GetAllProjectRolesForUser());
    const mapped = items.map(x => {
      const roles = allRoles[x.Id] || getEmptyRoleInfo();
      return context.runCommand(new MapToProjectDtoCommand(x, roles.projectRoles));
    });
    return Promise.all(mapped);
  }

  protected LogMessage() {
    return ["Projects.GetAllQuery"];
  }
}
