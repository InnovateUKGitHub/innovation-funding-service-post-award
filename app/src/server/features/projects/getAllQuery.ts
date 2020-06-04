import { QueryBase } from "../common";
import { GetAllProjectRolesForUser, mapToProjectDto } from "./";
import { IContext, ProjectDto } from "@framework/types";

export class GetAllQuery extends QueryBase<ProjectDto[]> {
  protected async Run(context: IContext) {
    const allRoles = await context.runQuery(new GetAllProjectRolesForUser());
    const items = await context.repositories.projects.getAll();
    return Promise.all (
      items.map(
        async (item) => {
          const roles = allRoles.forProject(item.Id).getRoles();
          const periods = await context.repositories.profileTotalPeriod.getByProjectIdAndPeriodId(
            item.Id,
            item.Acc_CurrentPeriodNumber__c
          );
          return mapToProjectDto(context, item, roles, periods[0]);
        }
      )
    );
  }

  protected LogMessage() {
    return ["Projects.GetAllQuery"];
  }
}
