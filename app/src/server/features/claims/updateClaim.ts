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

  protected async run(context: IContext): Promise<true> {
    const partnerQuery = new GetByIdQuery(this.claimDto.partnerId);
    const documentQuery = new GetClaimDocumentsQuery({ ...this.claimDto, projectId: this.projectId });
    const costSummaryQuery = new GetCostsSummaryForPeriodQuery(
      this.projectId,
      this.claimDto.partnerId,
      this.claimDto.periodId,
    );

    const existingClaim = await context.repositories.claims.get(this.claimDto.partnerId, this.claimDto.periodId);
    const existingStatus = existingClaim.Acc_ClaimStatus__c;
    const hasChangedClaimStatus = existingStatus !== this.claimDto.status;

    const partner = await context.runQuery(partnerQuery);
    const details = await context.runQuery(costSummaryQuery);
    const documents = await context.runQuery(documentQuery);

    const originalStatus = mapToClaimStatus(existingStatus);

    const result = new ClaimDtoValidator(
      this.claimDto,
      originalStatus,
      details,
      documents,
      true,
      partner.competitionType,
      this.isClaimSummary,
    );

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    if (hasChangedClaimStatus) {
      await context.repositories.claims.update({
        Id: this.claimDto.id,
        Acc_ClaimStatus__c: this.claimDto.status,
        Acc_ReasonForDifference__c: "",
      });

      await context.repositories.claimStatusChanges.create({
        Acc_Claim__c: this.claimDto.id,
        Acc_ExternalComment__c: this.claimDto.comments,
        Acc_ParticipantVisibility__c: this.getChangeStatusVisibility(originalStatus, this.claimDto),
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
    const hasVisibleStatus = this.participantVisibleStatus.includes(claimDto.status);

    if (hasVisibleStatus) return true;

    const currentlyQueried = existingStatus === ClaimStatus.INNOVATE_QUERIED;
    const updateStateIsAwaiting = claimDto.status === ClaimStatus.AWAITING_IUK_APPROVAL;

    return currentlyQueried && updateStateIsAwaiting;
  }
}
