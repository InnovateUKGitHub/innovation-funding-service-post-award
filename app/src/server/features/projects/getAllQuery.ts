import { ProjectDto } from "@framework/dtos/projectDto";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetAllProjectRolesForUser } from "./getAllProjectRolesForUser";
import { mapToProjectDto } from "./mapToProjectDto";

export class GetAllQuery extends AuthorisedAsyncQueryBase<ProjectDto[]> {
  public readonly runnableName: string = "GetAllQuery";
  protected async run(context: IContext) {
    const allRoles = await context.runQuery(new GetAllProjectRolesForUser());
    const items = await context.repositories.projects.getAll();
    return Promise.all(
      items.map(async item => {
        const roles = allRoles.forProject(item.Id).getRoles();
        return mapToProjectDto(context, item, roles);
      }),
    );
  }
}
