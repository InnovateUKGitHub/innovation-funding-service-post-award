import { QueryBase } from "@server/features/common";
import { GetAllProjectRolesForUser } from "@server/features/projects";
import { ISalesforceClaimStatusChange } from "@server/repositories";
import { ClaimStatusChangeDto, ProjectRole } from "@framework/dtos";
import { dateComparator, stringComparator } from "@framework/util/comparator";
import { IContext } from "@framework/types";

export class GetClaimStatusChangesQuery extends QueryBase<ClaimStatusChangeDto[]> {
  constructor(
    private readonly projectId: string,
    private readonly partherId: string,
    private readonly periodId: number,
  ) {
    super();
  }

  protected async Run(context: IContext) {
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const isMo = roles.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);

    const data: ISalesforceClaimStatusChange[] = await (
      isMo ?
      context.repositories.claimStatusChanges.getAllForClaim(this.partherId, this.periodId) :
      context.repositories.claimStatusChanges.getAllPartnerVisibleForClaim(this.partherId, this.periodId)
      );

    const mapped = data.map<ClaimStatusChangeDto>(x => this.map(context, x));
    return mapped.sort((a, b) => dateComparator(a.createdDate, b.createdDate) * -1 || stringComparator(a.id, b.id));
  }

  map(context: IContext, item: ISalesforceClaimStatusChange): ClaimStatusChangeDto {
    return {
      claimId: item.Acc_Claim__c,
      id: item.Id,
      comments: item.Acc_ExternalComment__c || "",
      previousStatus: item.Acc_PreviousClaimStatus__c,
      newStatus: item.Acc_NewClaimStatus__c,
      createdBy: item.CreatedBy.Name,
      createdDate: context.clock.parseRequiredSalesforceDateTime(item.CreatedDate),
    };
  }
}
