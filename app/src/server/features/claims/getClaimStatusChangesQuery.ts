import { QueryBase } from "@server/features/common";
import { GetAllProjectRolesForUser } from "@server/features/projects";
import { ISalesforceClaimStatusChange } from "@server/repositories";
import { ClaimStatusChangeDto, ProjectRole } from "@framework/dtos";
import { dateComparator, stringComparator } from "@framework/util/comparator";
import { Authorisation, IContext } from "@framework/types";

export class GetClaimStatusChangesQuery extends QueryBase<ClaimStatusChangeDto[]> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly periodId: number,
  ) {
    super();
  }

  public async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager)
      || auth.forPartner(this.projectId, this.partnerId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const isMo = roles.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
    const isFCPM = roles.forPartner(this.projectId, this.partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager);

    const data = await context.repositories.claimStatusChanges.getAllForClaim(this.partnerId, this.periodId);

    const mapped = data.map<ClaimStatusChangeDto>(x => this.map(context, x, isMo, isFCPM));
    return mapped.sort((a, b) => dateComparator(a.createdDate, b.createdDate) * -1 || stringComparator(a.id, b.id) * -1);
  }

  map(context: IContext, item: ISalesforceClaimStatusChange, canSeeHidden: boolean, canSeePublic: boolean): ClaimStatusChangeDto {
    return {
      claimId: item.Acc_Claim__c,
      id: item.Id,
      comments: canSeeHidden || (item.Acc_ParticipantVisibility__c && canSeePublic)  ? item.Acc_ExternalComment__c : "",
      previousStatus: item.Acc_PreviousClaimStatus__c,
      newStatus: item.Acc_NewClaimStatus__c,
      createdDate: context.clock.parseRequiredSalesforceDateTime(item.CreatedDate),
    };
  }
}
