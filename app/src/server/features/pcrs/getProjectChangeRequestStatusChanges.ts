import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectChangeRequestStatusChangeDto, ProjectRole } from "@framework/types";
import { dateComparator } from "@framework/util";
import { GetAllProjectRolesForUser } from "../projects";

export class GetProjectChangeRequestStatusChanges extends QueryBase<ProjectChangeRequestStatusChangeDto[]> {
  constructor( private readonly projectId: string, private readonly projectChangeRequestId: string ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<ProjectChangeRequestStatusChangeDto[]> {
    const statusChanges = await context.repositories.projectChangeRequestStatusChange.getStatusChanges(this.projectId, this.projectChangeRequestId);
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const isPm = roles.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
    const isMo = roles.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);

    return statusChanges
    .map<ProjectChangeRequestStatusChangeDto>(x => (
      {
        id: x.Id,
        projectChangeRequest: x.Acc_ProjectChangeRequest__c,
        newStatus: x.Acc_NewProjectChangeRequestStatus__c,
        previousStatus: x.Acc_PreviousProjectChangeRequestStatus__c,
        createdDate: context.clock.parseRequiredSalesforceDateTime(x.CreatedDate),
        comments: isMo || (isPm && x.Acc_ParticipantVisibility__c) ? x.Acc_ExternalComment__c : null,
        participantVisibility: x.Acc_ParticipantVisibility__c
      }
    )).sort((a, b) => dateComparator(b.createdDate, a.createdDate));
  }
}
