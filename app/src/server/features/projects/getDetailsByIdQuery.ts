import { QueryBase } from "../common";
import { GetAllProjectRolesForUser } from "./getAllProjectRolesForUser";
import { IContext, ProjectDto } from "@framework/types";
import { mapToProjectDto } from "@server/features/projects/mapToProjectDto";

export class GetByIdQuery extends QueryBase<ProjectDto> {
  constructor(private readonly projectId: string) {
    super();
  }

  async Run(context: IContext) {
    const item = await context.repositories.projects.getById(this.projectId);
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const roleInfo = roles.forProject(this.projectId).getRoles();
    const periods = await context.repositories.profileTotalPeriod.getByProjectIdAndPeriodId(
      item.Id,
      item.Acc_CurrentPeriodNumber__c
    );
    return mapToProjectDto(context, item, roleInfo, periods[0]);
  }
}
