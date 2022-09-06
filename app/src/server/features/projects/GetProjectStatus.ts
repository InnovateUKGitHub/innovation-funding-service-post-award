import { IContext, ProjectStatus, ProjectStatusDto } from "@framework/types";
import { QueryBase } from "../common";
import { GetByIdQuery } from ".";

export class GetProjectStatusQuery extends QueryBase<ProjectStatusDto> {
  constructor(private readonly projectId: string) {
    super();
  }

  static readonly inactiveStatuses = [
    ProjectStatus.OnHold,
    ProjectStatus.Closed,
    ProjectStatus.Terminated,
    ProjectStatus.Unknown,
  ];

  async run(context: IContext): Promise<ProjectStatusDto> {
    const { status } = await context.runQuery(new GetByIdQuery(this.projectId));

    const hasInactiveStatus = GetProjectStatusQuery.inactiveStatuses.includes(status);

    return {
      isActive: hasInactiveStatus === false,
      status,
    };
  }
}
