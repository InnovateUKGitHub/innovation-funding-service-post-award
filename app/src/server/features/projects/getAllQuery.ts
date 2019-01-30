import { QueryBase } from "../common/queryBase";
import { MapToProjectDtoCommand } from "./mapToProjectDto";
import { ProjectDto } from "../../../types";
import { GetAllProjectRolesForUser } from "./getAllProjectRolesForUser";
import { IContext } from "../../../types/IContext";

export class GetAllQuery extends QueryBase<ProjectDto[]> {
  protected async Run(context: IContext) {
    const items = await context.repositories.projects.getAll();
    const allRoles = await context.runQuery(new GetAllProjectRolesForUser());
    const mapped = items.map(x => {
      const roles = allRoles.for(x.Id).getRoles();
      return context.runCommand(new MapToProjectDtoCommand(x, roles));
    });
    return Promise.all(mapped);
  }

  protected LogMessage() {
    return ["Projects.GetAllQuery"];
  }
}
