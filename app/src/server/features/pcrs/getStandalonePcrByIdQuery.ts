import { ProjectRole } from "@framework/constants/project";
import { StandalonePcrDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";

export class GetStandalonePCRByIdQuery extends QueryBase<StandalonePcrDto> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly id: PcrId,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async run(context: IContext) {
    const result = await context.repositories.projectChangeRequests.getStandaloneEntityById(this.projectId, this.id);

    return {
      id: result.id,
      lastUpdated: result.updated,
      projectId: result.projectId,
      requestNumber: result.number,
      started: result.started,
      status: result.status,
      statusName: result.statusName,
    } as StandalonePcrDto;
  }
}
