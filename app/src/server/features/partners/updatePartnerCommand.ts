import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { Authorisation, IContext, PartnerDto, ProjectRole } from "@framework/types";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { PartnerSpendProfileStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { isBoolean } from "@framework/util";

export class UpdatePartnerCommand extends CommandBase<boolean> {
  constructor(
    private readonly partner: PartnerDto, private readonly validateBankDetails?: boolean) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forPartner(this.partner.projectId, this.partner.id).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    this.validateRequest();

    await context.repositories.partners.update({
      Id: this.partner.id,
      Acc_Postcode__c: this.partner.postcode,
      Acc_NewForecastNeeded__c: isBoolean(this.partner.newForecastNeeded) ? this.partner.newForecastNeeded : undefined,
      Acc_SpendProfileCompleted__c: new PartnerSpendProfileStatusMapper().mapToSalesforcePcrSpendProfileOverheadRateOption(this.partner.spendProfileStatus),
    });

    return true;
  }

  private validateRequest() {
    if(!this.partner) {
      throw new BadRequestError("Request is missing required fields");
    }

    const validationResult = new PartnerDtoValidator(this.partner, true, this.validateBankDetails);

    if(!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }
  }
}
