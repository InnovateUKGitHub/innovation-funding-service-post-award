import { QueryBase } from "../common";
import { GetAllProjectRolesForUser, MapToProjectDtoCommand } from "./";
import { IContext, ProjectDto } from "../../../types";

export class GetAllQuery extends QueryBase<ProjectDto[]> {
  protected async Run(context: IContext) {
    const items = await context.repositories.projects.getAll();
    const allRoles = await context.runQuery(new GetAllProjectRolesForUser());
    const mapped = items.map(x => {
      const roles = allRoles.forProject(x.Id).getRoles();
      return context.runCommand(new MapToProjectDtoCommand(x, roles));
    });
    return Promise.all(mapped);
  }

  protected LogMessage() {
    return ["Projects.GetAllQuery"];
  }
}
