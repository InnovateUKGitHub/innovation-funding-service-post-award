import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, PCRStatus, ProjectChangeRequestStatusChangeDto, ProjectRole } from "@framework/types";
import { dateComparator } from "@framework/util";
import { GetAllProjectRolesForUser } from "../projects";
import { ProjectChangeRequestStatusChangeEntity } from "@framework/entities";
import { GetPcrStatusesQuery } from "./getPcrStatusesQuery";
import { Option} from "@framework/types";

export class GetProjectChangeRequestStatusChanges extends QueryBase<ProjectChangeRequestStatusChangeDto[]> {
  constructor( private readonly projectId: string, private readonly projectChangeRequestId: string ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<ProjectChangeRequestStatusChangeDto[]> {
    const statusChanges = await context.repositories.projectChangeRequestStatusChange.getStatusChanges(this.projectId, this.projectChangeRequestId);
    const statusLookup = await context.runQuery(new GetPcrStatusesQuery());
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const isPm = roles.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
    const isMo = roles.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);

    return statusChanges
    .map<ProjectChangeRequestStatusChangeDto>(x => this.mapItem(context, x, isMo, isPm, statusLookup)).sort((a, b) => dateComparator(b.createdDate, a.createdDate));
  }

  protected mapItem(context: IContext, x: ProjectChangeRequestStatusChangeEntity, isMo: boolean, isPm: boolean, statusLookup: Map<PCRStatus, Option<PCRStatus>>): ProjectChangeRequestStatusChangeDto {
    const newStatus = x.newStatus;
    const previousStatus = x.previousStatus;
    const newStatusLookup = statusLookup.get(newStatus);
    const previousStatusLookup = statusLookup.get(previousStatus);
    return {
      id: x.id,
      projectChangeRequest: x.pcrId,
      newStatus,
      newStatusLabel:  newStatusLookup && newStatusLookup.label || "Unknown",
      previousStatus,
      previousStatusLabel: previousStatusLookup && previousStatusLookup.label || "Unknown",
      createdBy: x.createdBy,
      createdDate: x.createdDate,
      comments: isMo || (isPm && x.externalComments) ? x.externalComments : null,
      participantVisibility: x.participantVisibility
    };
  }
}
