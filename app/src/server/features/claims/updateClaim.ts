import { CommandBase, ValidationError } from "../common";
import { ClaimDtoValidator } from "../../../ui/validators/claimDtoValidator";
import { GetCostCategoriesQuery } from ".";
import { GetClaimDetailsSummaryForPartnerQuery } from "../claimDetails";
import { Authorisation, ClaimDto, IContext, ProjectRole } from "../../../types";

export class UpdateClaimCommand extends CommandBase<boolean> {
  constructor(private readonly projectId: string, private readonly claimDto: ClaimDto) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer)
      || auth.forPartner(this.projectId, this.claimDto.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const details = await context.runQuery(new GetClaimDetailsSummaryForPartnerQuery(this.projectId, this.claimDto.partnerId, this.claimDto.periodId));
    const result = new ClaimDtoValidator(this.claimDto, details, costCategories, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    const update = {
      Id: this.claimDto.id,
      Acc_ClaimStatus__c: this.claimDto.status,
      Acc_LineItemDescription__c: this.claimDto.comments,
    };

    return context.repositories.claims.update(update);
  }
}
