import { IContext, QueryBase } from "../common/context";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto } from "../../../types";
import { GetAllProjectRolesForUser } from "./getAllProjectRolesForUser";

export class GetAllQuery extends QueryBase<ProjectDto[]> {
  protected async Run(context: IContext) {
    const items = await context.repositories.projects.getAll();
    const allRoles = await context.runQuery(new GetAllProjectRolesForUser());
    const mapped = items.map(x => context.runCommand(new MapToProjectDtoCommand(x, allRoles[x.Id])));
    return Promise.all(mapped);
  }

  protected LogMessage() {
    return ["Projects.GetAllQuery"];
  }
}
