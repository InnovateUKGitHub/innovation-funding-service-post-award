import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocumentsSummary";
import { mapToClaimStatus } from "@server/features/claims/mapClaim";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ClaimDtoValidator } from "@ui/validation/validators/claimDtoValidator";
import { ValidationError } from "../common/appError";
import { GetCostsSummaryForPeriodQuery } from "../claimDetails/getCostsSummaryForPeriodQuery";
import { InActiveProjectError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetByIdQuery } from "../partners/getByIdQuery";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { mapToReceivedStatus } from "@gql/dtoMapper/mapClaimDto";

export class UpdateClaimCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: ProjectId,
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
    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isProjectActive) {
      throw new InActiveProjectError();
    }

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

    const originalClaimStatus = mapToClaimStatus(existingStatus);

    // TODO: Merge what we need automatically
    this.claimDto.iarStatus = mapToReceivedStatus(existingClaim.Acc_IAR_Status__c);
    this.claimDto.pcfStatus = mapToReceivedStatus(existingClaim.Acc_PCF_Status__c);

    const result = new ClaimDtoValidator(
      this.claimDto,
      originalClaimStatus,
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
        Acc_ParticipantVisibility__c: this.getChangeStatusVisibility(originalClaimStatus, this.claimDto),
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
