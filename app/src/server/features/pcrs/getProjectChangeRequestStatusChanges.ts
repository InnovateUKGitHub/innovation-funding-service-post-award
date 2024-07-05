import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { Option } from "@framework/dtos/option";
import { ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { ProjectChangeRequestStatusChangeEntity } from "@framework/entities/projectChangeRequest";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { dateComparator } from "@framework/util/comparator";
import { QueryBase } from "../common/queryBase";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { GetPcrStatusesQuery } from "./getPcrStatusesQuery";

export class GetProjectChangeRequestStatusChanges extends QueryBase<ProjectChangeRequestStatusChangeDto[]> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly projectChangeRequestId: PcrId,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  protected async run(context: IContext): Promise<ProjectChangeRequestStatusChangeDto[]> {
    const statusChanges = await context.repositories.projectChangeRequestStatusChange.getStatusChanges(
      this.projectId,
      this.projectChangeRequestId,
    );
    const statusLookup = await context.runQuery(new GetPcrStatusesQuery());
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const isPm = roles.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
    const isMo = roles.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);

    return statusChanges
      .map<ProjectChangeRequestStatusChangeDto>(x => this.mapItem(context, x, isMo, isPm, statusLookup))
      .sort((a, b) => dateComparator(b.createdDate, a.createdDate));
  }

  protected mapItem(
    context: IContext,
    entity: ProjectChangeRequestStatusChangeEntity,
    isMo: boolean,
    isPm: boolean,
    statusLookup: Option<PCRStatus>[],
  ): ProjectChangeRequestStatusChangeDto {
    const newStatus = entity.newStatus;
    const previousStatus = entity.previousStatus;
    const newStatusLookup = statusLookup.find(x => x.value === newStatus);
    const previousStatusLookup = statusLookup.find(x => x.value === previousStatus);
    return {
      id: entity.id,
      projectChangeRequest: entity.pcrId,
      newStatus,
      newStatusLabel: (newStatusLookup && newStatusLookup.label) || "Unknown",
      previousStatus,
      previousStatusLabel: (previousStatusLookup && previousStatusLookup.label) || "Unknown",
      createdBy: entity.createdBy,
      createdDate: entity.createdDate,
      comments: isMo || (isPm && entity.participantVisibility) ? entity.externalComments : null,
      participantVisibility: entity.participantVisibility,
    };
  }
}
