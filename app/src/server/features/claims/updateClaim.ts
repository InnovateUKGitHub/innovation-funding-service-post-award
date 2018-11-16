import { ICommand, IContext } from "../common/context";
import { ClaimDtoValidator } from "../../../ui/validators/claimDtoValidator";
import { GetCostCategoriesQuery } from ".";
import { GetClaimDetailsSummaryForPartnerQuery } from "../claimDetails";
import { ValidationError } from "../../../shared/validation";
import { ClaimDto } from "../../../types";

export class UpdateClaimCommand implements ICommand<boolean> {
  constructor(private claimDto: ClaimDto) { }

  public async Run(context: IContext) {

    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const details = await context.runQuery(new GetClaimDetailsSummaryForPartnerQuery(this.claimDto.partnerId, this.claimDto.periodId));
    const result = new ClaimDtoValidator(this.claimDto, details, costCategories, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    const update = {
      Id: this.claimDto.id,
      Acc_ClaimStatus__c: this.claimDto.status,
      Acc_LineItemDescription__c: this.claimDto.comments,
    };

    return await context.repositories.claims.update(update);
  }
}
