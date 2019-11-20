import { QueryBase } from "../common";
import { GetAllProjectRolesForUser, mapToProjectDto } from "./";
import { IContext, ProjectDto } from "@framework/types";

export class GetAllQuery extends QueryBase<ProjectDto[]> {
  protected async Run(context: IContext) {
    const items = await context.repositories.projects.getAll();
    const allRoles = await context.runQuery(new GetAllProjectRolesForUser());
    return items.map(x => {
      const roles = allRoles.forProject(x.Id).getRoles();
      return mapToProjectDto(context, x, roles);
    });
  }

  protected LogMessage() {
    return ["Projects.GetAllQuery"];
  }
}
