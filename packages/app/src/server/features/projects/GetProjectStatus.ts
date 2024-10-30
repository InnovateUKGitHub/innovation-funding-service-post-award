import { ProjectStatus } from "@framework/constants/project";
import { ProjectStatusDto } from "@framework/dtos/projectStatusDto";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetByIdQuery } from "./getDetailsByIdQuery";

export class GetProjectStatusQuery extends AuthorisedAsyncQueryBase<ProjectStatusDto> {
  public readonly runnableName: string = "GetProjectStatusQuery";
  constructor(private readonly projectId: ProjectId) {
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
