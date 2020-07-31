import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { Authorisation, BankCheckStatus, IContext, PartnerDto, PartnerStatus, ProjectRole } from "@framework/types";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { BankCheckStatusMapper, BankDetailsTaskStatusMapper, PartnerStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { isBoolean } from "@framework/util";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetPartnerDocumentsQuery } from "@server/features/documents/getPartnerDocumentsSummary";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

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
    const partnerDocuments = await context.runQuery(new GetPartnerDocumentsQuery(this.partner.projectId, this.partner.id));

    this.validateRequest(originalDto, partnerDocuments);

    const update = {};

    if (this.partner.partnerStatus === PartnerStatus.Pending) {
      if (this.partner.bankCheckStatus === BankCheckStatus.NotValidated && this.validateBankDetails) {
        await this.bankCheckValidate(update, context);
      }
    }

    await context.repositories.partners.update({
      ...update,
      Id: this.partner.id,
      Acc_Postcode__c: this.partner.postcode,
      Acc_NewForecastNeeded__c: isBoolean(this.partner.newForecastNeeded) ? this.partner.newForecastNeeded : undefined,
      Acc_ParticipantStatus__c: new PartnerStatusMapper().mapToSalesforce(this.partner.partnerStatus),
    });

    return true;
  }

  private async bankCheckValidate(update: any, context: IContext) {
    if (!this.partner.sortCode || !this.partner.accountNumber) {
      throw new BadRequestError("Sort code or account number not provided");
    }

    const bankCheckValidateResult = await context.resources.bankCheckService.validate(this.partner.sortCode, this.partner.accountNumber);

    const validationResult = bankCheckValidateResult.ValidationResult;

    if (!validationResult.checkPassed) {
      if (this.partner.bankCheckValidationAttempts < 2) {
        throw new BadRequestError("Validation failed");
      }
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationFailed);
    } else {
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationPassed);
    }

    update.Acc_ValidationCheckPassed__c = validationResult.checkPassed;
    update.Acc_Iban__c = validationResult.iban;
    update.Acc_ValidationConditionsSeverity__c = validationResult.conditions.severity;
    update.Acc_ValidationConditionsCode__c = validationResult.conditions.code;
    update.Acc_ValidationConditionsDesc__c = validationResult.conditions.description;
    update.Acc_AccountNumber__c = this.partner.accountNumber;
    update.Acc_SortCode__c = this.partner.sortCode;
    update.Acc_RegistrationNumber__c = this.partner.companyNumber;
    update.Acc_FirstName__c = this.partner.firstName;
    update.Acc_LastName__c = this.partner.lastName;
    update.Acc_AddressStreet__c = this.partner.accountStreet;
    update.Acc_AddressTown__c = this.partner.accountTownOrCity;
    update.Acc_AddressBuildingName__c = this.partner.accountBuilding;
    update.Acc_AddressLocality__c = this.partner.accountLocality;
    update.Acc_AddressPostcode__c = this.partner.accountPostcode;
    update.Acc_BankCheckCompleted__c = new BankDetailsTaskStatusMapper().mapToSalesforce(this.partner.bankDetailsTaskStatus);
  }

  private validateRequest(originalDto: PartnerDto, partnerDocuments: DocumentSummaryDto[]) {
    if(!this.partner) {
      throw new BadRequestError("Request is missing required fields");
    }

    if (originalDto.partnerStatus !== PartnerStatus.Pending && this.validateBankDetails) {
      throw new BadRequestError("Cannot validate bank details for an active partner");
    }

    const validationResult = new PartnerDtoValidator(this.partner, originalDto, partnerDocuments, true, this.validateBankDetails);

    if(!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }
  }
}
