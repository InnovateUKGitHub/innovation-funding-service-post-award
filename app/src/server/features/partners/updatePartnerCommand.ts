import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { Authorisation, IContext, PartnerDto, PartnerStatus, ProjectRole } from "@framework/types";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { PartnerStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { isBoolean } from "@framework/util";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";

export class UpdatePartnerCommand extends CommandBase<boolean> {
  constructor(
    private readonly partner: PartnerDto, private readonly validateBankDetails?: boolean) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forPartner(this.partner.projectId, this.partner.id).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {

    const originalDto = await context.runQuery(new GetByIdQuery(this.partner.id));

    this.validateRequest(originalDto);

    await context.repositories.partners.update({
      Id: this.partner.id,
      Acc_Postcode__c: this.partner.postcode,
      Acc_NewForecastNeeded__c: isBoolean(this.partner.newForecastNeeded) ? this.partner.newForecastNeeded : undefined,
      Acc_ParticipantStatus__c: new PartnerStatusMapper().mapToSalesforce(this.partner.partnerStatus),
    });

    return true;
  }

  private validateRequest(originalDto: PartnerDto) {
    if(!this.partner) {
      throw new BadRequestError("Request is missing required fields");
    }

    if (originalDto.partnerStatus !== PartnerStatus.Pending && this.validateBankDetails) {
      throw new BadRequestError("Cannot validate bank details for an active partner");
    }

    const validationResult = new PartnerDtoValidator(this.partner, originalDto, true, this.validateBankDetails);

    if(!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }
  }
}
