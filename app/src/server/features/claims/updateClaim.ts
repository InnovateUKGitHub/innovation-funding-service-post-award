import { CommandBase, ValidationError } from "@server/features/common";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Authorisation, ClaimDto, ClaimStatus, IContext, ProjectRole } from "@framework/types";
import { GetCostsSummaryForPeriodQuery } from "../claimDetails";
import { GetCostCategoriesQuery } from "@server/features/claims/getCostCategoriesQuery";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocumentsSummary";

export class UpdateClaimCommand extends CommandBase<boolean> {
  constructor(private readonly projectId: string, private readonly claimDto: ClaimDto) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer)
      || auth.forPartner(this.projectId, this.claimDto.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const existingStatus = await context.repositories.claims.get(this.claimDto.partnerId, this.claimDto.periodId).then(x => x.Acc_ClaimStatus__c);
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const details = await context.runQuery(new GetCostsSummaryForPeriodQuery(this.projectId, this.claimDto.partnerId, this.claimDto.periodId));
    const documents = await context.runQuery(
      new GetClaimDocumentsQuery({ projectId: this.projectId, partnerId: this.claimDto.partnerId, periodId: this.claimDto.periodId})
    );
    const result = new ClaimDtoValidator(this.claimDto, existingStatus, details, costCategories, documents, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    if(existingStatus !== this.claimDto.status) {
      await context.repositories.claims.update({
        Id: this.claimDto.id,
        Acc_ClaimStatus__c: this.claimDto.status,
        Acc_ReasonForDifference__c: "",
      });

      await context.repositories.claimStatusChanges.create({
        Acc_Claim__c:this.claimDto.id,
        Acc_ExternalComment__c: this.claimDto.comments,
        Acc_ParticipantVisibility__c: this.getChangeStatusVisibility(this.claimDto)
      });
    }
    else {
      await context.repositories.claims.update({
        Id: this.claimDto.id,
        Acc_ClaimStatus__c: this.claimDto.status,
        Acc_ReasonForDifference__c: this.claimDto.comments,
      });
    }

    return true;
  }

  private participantVisibleStatus: ClaimStatus[] = [
    ClaimStatus.DRAFT,
    ClaimStatus.MO_QUERIED,
    ClaimStatus.SUBMITTED,
    ClaimStatus.AWAITING_IAR

  ];
  private getChangeStatusVisibility(claimDto: ClaimDto): boolean {
    return this.participantVisibleStatus.indexOf(claimDto.status) !== -1;
  }
}
