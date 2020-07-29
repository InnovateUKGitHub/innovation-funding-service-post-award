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
      // TODO
      // Acc_AccountNumber__c: this.partner.accountNumber ? this.partner.accountNumber : undefined,
      // Acc_SortCode__c: this.partner.sortCode ? this.partner.sortCode : undefined,
      Acc_RegistrationNumber__c: this.partner.companyNumber ? this.partner.companyNumber : undefined,
      Acc_FirstName__c: this.partner.firstName ? this.partner.firstName : undefined,
      Acc_LastName__c: this.partner.lastName ? this.partner.lastName : undefined,
      Acc_AddressStreet__c: this.partner.accountStreet ? this.partner.accountStreet : undefined,
      Acc_AddressTown__c: this.partner.accountTownOrCity ? this.partner.accountTownOrCity : undefined,
      Acc_AddressBuildingName__c: this.partner.accountBuilding ? this.partner.accountBuilding : undefined,
      Acc_AddressLocality__c: this.partner.accountLocality ? this.partner.accountLocality : undefined,
      Acc_AddressPostcode__c: this.partner.accountPostcode ? this.partner.accountPostcode : undefined,
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
