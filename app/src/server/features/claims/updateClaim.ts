import { CommandBase, ValidationError } from "@server/features/common";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Authorisation, ClaimDto, ClaimStatus, IContext, ProjectRole } from "@framework/types";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocumentsSummary";
import { mapToClaimStatus } from "@server/features/claims/mapClaim";
import { GetCostsSummaryForPeriodQuery } from "@server/features/claimDetails";
import { GetByIdQuery } from "@server/features/partners";

export class UpdateClaimCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: string,
    private readonly claimDto: ClaimDto,
    private readonly isClaimSummary?: boolean,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    const hasMoRole = auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
    const hasFcRole = auth.forPartner(this.projectId, this.claimDto.partnerId).hasRole(ProjectRole.FinancialContact);

    return hasMoRole || hasFcRole;
  }

  protected async run(context: IContext) {
    const existingStatus = await context.repositories.claims
      .get(this.claimDto.partnerId, this.claimDto.periodId)
      .then(x => x.Acc_ClaimStatus__c);
    const partner = await context.runQuery(new GetByIdQuery(this.claimDto.partnerId));
    const details = await context.runQuery(
      new GetCostsSummaryForPeriodQuery(this.projectId, this.claimDto.partnerId, this.claimDto.periodId),
    );
    const documents = await context.runQuery(
      new GetClaimDocumentsQuery({
        projectId: this.projectId,
        partnerId: this.claimDto.partnerId,
        periodId: this.claimDto.periodId,
      }),
    );

    const result = new ClaimDtoValidator(
      this.claimDto,
      mapToClaimStatus(existingStatus),
      details,
      documents,
      true,
      partner.competitionType,
      this.isClaimSummary,
    );

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    if (existingStatus !== this.claimDto.status) {
      await context.repositories.claims.update({
        Id: this.claimDto.id,
        Acc_ClaimStatus__c: this.claimDto.status,
        Acc_ReasonForDifference__c: "",
      });

      await context.repositories.claimStatusChanges.create({
        Acc_Claim__c: this.claimDto.id,
        Acc_ExternalComment__c: this.claimDto.comments,
        Acc_ParticipantVisibility__c: this.getChangeStatusVisibility(mapToClaimStatus(existingStatus), this.claimDto),
      });
    } else {
      await context.repositories.claims.update({
        Id: this.claimDto.id,
        Acc_ClaimStatus__c: this.claimDto.status,
        Acc_ReasonForDifference__c: this.claimDto.comments,
      });
    }

    return true;
  }

  private readonly participantVisibleStatus: ClaimStatus[] = [
    ClaimStatus.DRAFT,
    ClaimStatus.MO_QUERIED,
    ClaimStatus.SUBMITTED,
    ClaimStatus.AWAITING_IAR,
  ];

  private getChangeStatusVisibility(existingStatus: ClaimStatus, claimDto: ClaimDto): boolean {
    return (
      this.participantVisibleStatus.indexOf(claimDto.status) !== -1 ||
      (existingStatus === ClaimStatus.INNOVATE_QUERIED && claimDto.status === ClaimStatus.AWAITING_IUK_APPROVAL)
    );
  }
}
