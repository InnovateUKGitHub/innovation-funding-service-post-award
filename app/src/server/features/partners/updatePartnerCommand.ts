import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { Authorisation, IContext, PartnerDto, ProjectRole } from "@framework/types";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";

export class UpdatePartnerCommand extends CommandBase<boolean> {
  constructor(private readonly partner: PartnerDto) {
    super();
  }

  /// @TODO: Identify who should be able to modify the partner's postcode and under what circumstances;
  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forPartner(this.partner.projectId, this.partner.id).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    this.validateRequest();

    await context.repositories.partners.update({
      Id: this.partner.id,
      Acc_Postcode__c: this.partner.postcode
    });

    return true;
  }

  private validateRequest() {
    if(!this.partner) {
      throw new BadRequestError("Request is missing required fields");
    }

    const validationResult = new PartnerDtoValidator(this.partner, true);

    if(!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }
  }
}
