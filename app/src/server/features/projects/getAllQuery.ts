import { IContext, ProjectDto } from "@framework/types";
import { QueryBase } from "../common";
import { GetAllProjectRolesForUser, mapToProjectDto } from "./";

export class GetAllQuery extends QueryBase<ProjectDto[]> {
  protected async run(context: IContext) {
    const allRoles = await context.runQuery(new GetAllProjectRolesForUser());
    const items = await context.repositories.projects.getAll();
    return Promise.all (
      items.map(
        async (item) => {
          const roles = allRoles.forProject(item.Id).getRoles();
          return mapToProjectDto(context, item, roles);
        }
      )
    );
  }

  protected logMessage() {
    return ["Projects.GetAllQuery"];
  }
}
