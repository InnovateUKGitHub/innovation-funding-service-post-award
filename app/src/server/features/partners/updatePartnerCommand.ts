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
        await this.bankCheckValidate(originalDto, partnerDocuments, update, context);
      }
      else if (this.partner.bankCheckStatus === BankCheckStatus.ValidationPassed && this.validateBankDetails) {
        await this.updateBankDetails(update);
      }
    }

    await context.repositories.partners.update({
      ...update,
      Id: this.partner.id,
      Acc_Postcode__c: this.partner.postcode,
      Acc_NewForecastNeeded__c: isBoolean(this.partner.newForecastNeeded) ? this.partner.newForecastNeeded : undefined,
      Acc_ParticipantStatus__c: new PartnerStatusMapper().mapToSalesforce(this.partner.partnerStatus),
      Acc_BankCheckCompleted__c: new BankDetailsTaskStatusMapper().mapToSalesforce(this.partner.bankDetailsTaskStatus),
    });

    return true;
  }

  private async updateBankDetails(update: any) {
    const { bankDetails } = this.partner;
    update.Acc_RegistrationNumber__c = bankDetails.companyNumber;
    update.Acc_FirstName__c = bankDetails.firstName;
    update.Acc_LastName__c = bankDetails.lastName;
    update.Acc_AddressStreet__c = bankDetails.address.accountStreet;
    update.Acc_AddressTown__c = bankDetails.address.accountTownOrCity;
    update.Acc_AddressBuildingName__c = bankDetails.address.accountBuilding;
    update.Acc_AddressLocality__c = bankDetails.address.accountLocality;
    update.Acc_AddressPostcode__c = bankDetails.address.accountPostcode;
  }

  private async bankCheckValidate(originalDto: PartnerDto, partnerDocuments: DocumentSummaryDto[], update: any, context: IContext) {
    const { bankDetails } = this.partner;
    if (!bankDetails.sortCode || !bankDetails.accountNumber) {
      throw new BadRequestError("Sort code or account number not provided");
    }

    const bankCheckValidateResult = await context.resources.bankCheckService.validate(bankDetails.sortCode, bankDetails.accountNumber);

    const validationResult = bankCheckValidateResult.ValidationResult;

    if (!validationResult.checkPassed) {
      if (this.partner.bankCheckValidationAttempts <= context.config.bankCheckValidationAttempts) {
        throw new ValidationError(
          new PartnerDtoValidator(this.partner, originalDto, partnerDocuments, {
            showValidationErrors: true,
            validateBankDetails: true,
            failBankValidation: true
          })
        );
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
    update.Acc_AccountNumber__c = bankDetails.accountNumber;
    update.Acc_SortCode__c = bankDetails.sortCode;
    this.updateBankDetails(update);
  }

  private validateRequest(originalDto: PartnerDto, partnerDocuments: DocumentSummaryDto[]) {
    if(!this.partner) {
      throw new BadRequestError("Request is missing required fields");
    }

    if (originalDto.partnerStatus !== PartnerStatus.Pending && this.validateBankDetails) {
      throw new BadRequestError("Cannot validate bank details for an active partner");
    }

    const validationResult = new PartnerDtoValidator(this.partner, originalDto, partnerDocuments, {
      showValidationErrors: true,
      validateBankDetails: this.validateBankDetails
    });

    if(!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }
  }
}
