import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { Authorisation, BankCheckStatus, BankDetailsTaskStatus, IContext, PartnerDto, PartnerStatus, ProjectRole } from "@framework/types";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { BankCheckStatusMapper, BankDetailsTaskStatusMapper, PartnerStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { isBoolean, isNumber } from "@framework/util";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetPartnerDocumentsQuery } from "@server/features/documents/getPartnerDocumentsSummary";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { BankCheckVerificationResultFields } from "@framework/types/bankCheck";

export class UpdatePartnerCommand extends CommandBase<boolean> {
  constructor(
    private readonly partner: PartnerDto,
    private readonly validateBankDetails?: boolean,
    private readonly verifyBankDetails?: boolean
  ) {
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

      if (this.partner.bankCheckStatus === BankCheckStatus.ValidationPassed && this.validateBankDetails) {
        await this.updateBankDetails(update);
      }

      if (this.partner.bankCheckStatus === BankCheckStatus.ValidationPassed && this.verifyBankDetails) {
        await this.bankCheckVerify(update, context);
      }
    }

    await context.repositories.partners.update({
      ...update,
      Id: this.partner.id,
      Acc_Postcode__c: this.partner.postcode || undefined,
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
      if (this.partner.bankCheckRetryAttempts < context.config.options.bankCheckValidationRetries) {
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
    update.Acc_ValidationConditionsCode__c = validationResult.conditions.code ? validationResult.conditions.code.toString() : "";
    update.Acc_ValidationConditionsDesc__c = validationResult.conditions.description;
    update.Acc_AccountNumber__c = bankDetails.accountNumber;
    update.Acc_SortCode__c = bankDetails.sortCode;
    this.updateBankDetails(update);
  }

  private async bankCheckVerify(update: any, context: IContext) {
    const { bankDetails } = this.partner;
    const verifyInputs = {
      companyName: this.partner.name,
      registrationNumber: bankDetails.companyNumber ? bankDetails.companyNumber : "",
      sortcode: bankDetails.sortCode!,
      accountNumber: bankDetails.accountNumber!,
      // As these are business accounts they do not have a named account holder associated, however these values seem to be required by the Experian Verify API. As such, we are hardcoding dummy values for them here.
      firstName: "NA",
      lastName: "NA",
      address: {
        organisation: "",
        buildingName: bankDetails.address ? bankDetails.address.accountBuilding : "",
        street: bankDetails.address ? bankDetails.address.accountStreet : "",
        locality: bankDetails.address ? bankDetails.address.accountLocality : "",
        town: bankDetails.address ? bankDetails.address.accountTownOrCity : "",
        postcode: bankDetails.address ? bankDetails.address.accountPostcode : "",
      },
    };
    const bankCheckVerifyResult = await context.resources.bankCheckService.verify(verifyInputs);
    const { VerificationResult } = bankCheckVerifyResult;

    if (!this.validateVerifyResponse(VerificationResult, context)) {
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.VerificationFailed);
    } else {
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.VerificationPassed);
      this.partner.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
    }

    update.Acc_AddressScore__c = VerificationResult.addressScore;
    update.Acc_CompanyNameScore__c = VerificationResult.companyNameScore;
    update.Acc_PersonalDetailsScore__c = VerificationResult.personalDetailsScore;
    update.Acc_RegNumberScore__c = VerificationResult.regNumberScore;
    update.Acc_VerificationConditionsSeverity__c = VerificationResult.conditions.severity;
    update.Acc_VerificationConditionsCode__c = VerificationResult.conditions.code ? VerificationResult.conditions.code.toString() : "";
    update.Acc_VerificationConditionsDesc__c = VerificationResult.conditions.description;
  }

  private validateVerifyResponse(VerificationResult: BankCheckVerificationResultFields, context: IContext) {
    // Only checking against address and company name scores as personal details score will always fail.
    if ((!isNumber(VerificationResult.addressScore) || VerificationResult.addressScore < context.config.options.bankCheckAddressScorePass)
    || (!isNumber(VerificationResult.companyNameScore) || VerificationResult.companyNameScore < context.config.options.bankCheckCompanyNameScorePass)) {
      return false;
    }
    if (this.partner.organisationType === "Industrial") {
      return VerificationResult.regNumberScore && VerificationResult.regNumberScore === "Match";
    }
    return true;
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
      validateBankDetails: this.validateBankDetails || this.verifyBankDetails
    });

    if(!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }
  }
}
