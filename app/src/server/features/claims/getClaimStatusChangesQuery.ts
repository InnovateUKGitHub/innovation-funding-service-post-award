import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectRole } from "@framework/constants/project";
import { ClaimStatusChangeDto } from "@framework/dtos/claimDto";
import { Option } from "@framework/dtos/option";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { dateComparator, stringComparator } from "@framework/util/comparator";
import { GetClaimStatusesQuery } from "@server/features/claims/getClaimStatusesQuery";
import { mapToClaimStatus, mapToClaimStatusLabel } from "@server/features/claims/mapClaim";
import { ISalesforceClaimStatusChange } from "@server/repositories/claimStatusChangeRepository";
import { QueryBase } from "../common/queryBase";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";

export class GetClaimStatusChangesQuery extends QueryBase<ClaimStatusChangeDto[]> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    private readonly periodId: number,
  ) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    const isProjectMoPm = auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);

    const isPartnerPmFc = auth
      .forPartner(this.projectId, this.partnerId)
      .hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);

    return isProjectMoPm || isPartnerPmFc;
  }

  protected async run(context: IContext): Promise<ClaimStatusChangeDto[]> {
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const isMo = roles.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
    const isFcPm = roles
      .forPartner(this.projectId, this.partnerId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager);

    const claimStatuses = await context.runQuery(new GetClaimStatusesQuery());
    const partner = await context.repositories.partners.getById(this.partnerId);
    const data = await context.repositories.claimStatusChanges.getAllForClaim(this.partnerId, this.periodId);

    const mapped = data.map<ClaimStatusChangeDto>(x =>
      this.map(context, x, claimStatuses, isMo, isFcPm, partner.competitionType),
    );

    return mapped.sort(
      (a, b) => dateComparator(a.createdDate, b.createdDate) * -1 || stringComparator(a.id, b.id) * -1,
    );
  }

  map(
    context: IContext,
    item: ISalesforceClaimStatusChange,
    claimStatuses: Option<ClaimStatus>[],
    canSeeHidden: boolean,
    canSeePublic: boolean,
    competitionType: PartnerDto["competitionType"],
  ): ClaimStatusChangeDto {
    const commentIsPublic = canSeeHidden || (item.Acc_ParticipantVisibility__c && canSeePublic);
    const comments = commentIsPublic ? item.Acc_ExternalComment__c : "";

    const previousStatus = mapToClaimStatus(item.Acc_PreviousClaimStatus__c);
    const prevClaimStatusOption = claimStatuses.find(x => x.value === previousStatus);
    const previousStatusLabel = prevClaimStatusOption?.label || item.Acc_PreviousClaimStatus__c;

    const newStatus = mapToClaimStatus(item.Acc_NewClaimStatus__c);
    const newClaimStatusOption = claimStatuses.find(x => x.value === newStatus);
    const unCheckedStatusLabel = newClaimStatusOption?.label || item.Acc_NewClaimStatus__c;
    const newStatusLabel = mapToClaimStatusLabel(newStatus, unCheckedStatusLabel, competitionType);

    return {
      claimId: item.Acc_Claim__c,
      id: item.Id,
      comments,
      previousStatus,
      previousStatusLabel,
      newStatus,
      newStatusLabel,
      createdDate: context.clock.parseRequiredSalesforceDateTime(item.CreatedDate),
      createdBy: item.Acc_CreatedByAlias__c,
    };
  }
}
