/* eslint-disable @typescript-eslint/naming-convention */
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import {
  BankCheckStatusMapper,
  BankDetailsTaskStatusMapper,
  PartnerStatusMapper,
} from "@server/features/partners/mapToPartnerDto";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetPartnerDocumentsQuery } from "@server/features/documents/getPartnerDocumentsSummaryQuery";
import { BankCheckVerificationResultFields } from "@framework/types/bankCheck";
import { GetBankVerificationDetailsByIdQuery } from "./getBankVerificationDetailsByIdQuery";
import { PartnerStatus, BankCheckStatus, BankDetailsTaskStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforcePartner } from "@server/repositories/partnersRepository";
import { InActiveProjectError, BadRequestError, ValidationError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { isBoolean } from "@framework/util/booleanHelper";
import { isNumber } from "@framework/util/numberHelper";
import { merge } from "lodash";

type PartnerUpdatable = Updatable<ISalesforcePartner>;
export class UpdatePartnerCommand extends CommandBase<boolean> {
  private mergedPartner: PartnerDto | null = null;

  constructor(
    private readonly partner: PickRequiredFromPartial<PartnerDto, "id" | "projectId">,
    private readonly validateBankDetails?: boolean,
    private readonly verifyBankDetails?: boolean,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth
      .forPartner(this.partner.projectId, this.partner.id)
      .hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected async run(context: IContext) {
    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.partner.projectId));

    if (!isProjectActive) {
      throw new InActiveProjectError();
    }

    const originalDto = await context.runQuery(new GetByIdQuery(this.partner.id));
    const partnerDocuments = await context.runQuery(
      new GetPartnerDocumentsQuery(this.partner.projectId, this.partner.id),
    );

    const mergedPartner: PartnerDto = merge(originalDto, this.partner);
    this.mergedPartner = mergedPartner;
    this.validateRequest(originalDto, partnerDocuments);

    const update: PartnerUpdatable = {
      Id: this.partner.id,
    };

    if (mergedPartner.partnerStatus === PartnerStatus.Pending) {
      if (mergedPartner.bankCheckStatus === BankCheckStatus.NotValidated && this.validateBankDetails) {
        await this.bankCheckValidate(originalDto, partnerDocuments, update, context);
      }

      if (mergedPartner.bankCheckStatus === BankCheckStatus.ValidationPassed && this.validateBankDetails) {
        await this.updateBankDetails(update);
      }

      if (mergedPartner.bankCheckStatus === BankCheckStatus.ValidationPassed && this.verifyBankDetails) {
        await this.bankCheckVerify(update, context);
      }
    }

    await context.repositories.partners.update({
      ...update,
      Acc_Postcode__c: mergedPartner.postcode ?? undefined,
      Acc_NewForecastNeeded__c: isBoolean(mergedPartner.newForecastNeeded)
        ? mergedPartner.newForecastNeeded
        : undefined,
      Acc_ParticipantStatus__c: new PartnerStatusMapper().mapToSalesforce(mergedPartner.partnerStatus),
      Acc_BankCheckCompleted__c: new BankDetailsTaskStatusMapper().mapToSalesforce(mergedPartner.bankDetailsTaskStatus),
    });

    return true;
  }

  private async updateBankDetails(update: PartnerUpdatable) {
    if (!this.mergedPartner) {
      throw new Error("attempting to update bank details without bank details present");
    }
    const { bankDetails } = this.mergedPartner;
    update.Acc_RegistrationNumber__c = bankDetails.companyNumber ?? undefined;
    update.Acc_FirstName__c = bankDetails.firstName ?? undefined;
    update.Acc_LastName__c = bankDetails.lastName ?? undefined;
    update.Acc_AddressStreet__c = bankDetails.address.accountStreet ?? undefined;
    update.Acc_AddressTown__c = bankDetails.address.accountTownOrCity ?? undefined;
    update.Acc_AddressBuildingName__c = bankDetails.address.accountBuilding ?? undefined;
    update.Acc_AddressLocality__c = bankDetails.address.accountLocality ?? undefined;
    update.Acc_AddressPostcode__c = bankDetails.address.accountPostcode ?? undefined;
  }

  private async bankCheckValidate(
    originalDto: PartnerDto,
    partnerDocuments: DocumentSummaryDto[],
    update: PartnerUpdatable,
    context: IContext,
  ) {
    if (!this.mergedPartner) {
      throw new Error("attempting to validate bank details without bank details present");
    }
    const { bankDetails } = this.mergedPartner;
    if (!bankDetails.sortCode || !bankDetails.accountNumber) {
      throw new BadRequestError("Sort code or account number not provided");
    }

    const { ValidationResult } = await context.resources.bankCheckService.validate(
      bankDetails.sortCode,
      bankDetails.accountNumber,
    );

    console.log("update partner command bank check validate result", ValidationResult);

    if (!ValidationResult.checkPassed) {
      if (this.mergedPartner.bankCheckRetryAttempts < context.config.options.bankCheckValidationRetries) {
        throw new ValidationError(
          new PartnerDtoValidator(this.mergedPartner, originalDto, partnerDocuments, {
            showValidationErrors: true,
            validateBankDetails: true,
            failBankValidation: true,
          }),
        );
      }
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationFailed);
    } else {
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationPassed);
    }

    update.Acc_ValidationCheckPassed__c = ValidationResult.checkPassed;
    update.Acc_Iban__c = ValidationResult.iban ?? undefined;
    update.Acc_AccountNumber__c = bankDetails.accountNumber;
    update.Acc_SortCode__c = bankDetails.sortCode;

    if (ValidationResult.conditions) {
      update.Acc_ValidationConditionsSeverity__c = ValidationResult.conditions.severity;
      update.Acc_ValidationConditionsCode__c = ValidationResult.conditions.code?.toString() || "";
      update.Acc_ValidationConditionsDesc__c = ValidationResult.conditions.description;
    }

    this.updateBankDetails(update);
  }

  /**
   * Verify a project partner's bank account number/sort code and address.
   *
   * @param update The pass-by-reference object of items that we wish to update
   * @param context The user context to run upon.
   */
  private async bankCheckVerify(update: PartnerUpdatable, context: IContext) {
    // When a user wants to verify their bank details, they will be on a "confirmation screen".
    // This confirmation screen displays their account number and sort code with a mask.
    // (e.g. User will send in XX4749 and XXXX8818, so we can't verify on that!)
    //
    // To solve this, we grab the plaintext sort code/account number from Salesforce
    // using the Bank Details service user.
    const unmaskedPartnerDto = await context
      .asBankDetailsValidationUser()
      .runQuery(new GetBankVerificationDetailsByIdQuery(this.partner.id));

    if (!this.mergedPartner) {
      throw new Error("attempting to verify bank details without bank details present");
    }

    // Grab the bank details from the unmasked partner.
    const { bankDetails } = unmaskedPartnerDto;

    // Run a verification against the bank details that we have re-obtained from Salesforce.
    const bankCheckVerifyResult = await context.resources.bankCheckService.verify({
      companyName: this.mergedPartner.name,
      registrationNumber: bankDetails.companyNumber ?? "",
      sortcode: bankDetails.sortCode ?? "",
      accountNumber: bankDetails.accountNumber ?? "",
      // As these are business accounts they do not have a named account holder associated,
      // however these values seem to be required by the Experian Verify API.
      // As such, we are hardcoding dummy values for them here.
      firstName: "NA",
      lastName: "NA",
      address: {
        organisation: "",
        buildingName: bankDetails.address?.accountBuilding ?? "",
        street: bankDetails.address?.accountStreet ?? "",
        locality: bankDetails.address?.accountLocality ?? "",
        town: bankDetails.address?.accountTownOrCity ?? "",
        postcode: bankDetails.address?.accountPostcode ?? "",
      },
    });
    const { VerificationResult } = bankCheckVerifyResult;

    if (!this.validateVerifyResponse(VerificationResult, context)) {
      // If we have failed the test, mark the verification as failed.
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.VerificationFailed);
    } else {
      // Otherwise, mark as passed and move the partner onto the "complete" stage.
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.VerificationPassed);
      this.partner.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
    }

    // Save the Experian verification score to Salesforce
    update.Acc_AddressScore__c = VerificationResult.addressScore ?? undefined;
    update.Acc_CompanyNameScore__c = VerificationResult.companyNameScore ?? undefined;
    update.Acc_PersonalDetailsScore__c = VerificationResult.personalDetailsScore ?? undefined;
    update.Acc_RegNumberScore__c = VerificationResult.regNumberScore ?? undefined;

    // Save Experian errors and warnings to Salesforce
    if (VerificationResult.conditions) {
      update.Acc_VerificationConditionsSeverity__c = VerificationResult.conditions.severity;
      update.Acc_VerificationConditionsCode__c = VerificationResult.conditions.code?.toString() || "";
      update.Acc_VerificationConditionsDesc__c = VerificationResult.conditions.description;
    }
  }

  private validateVerifyResponse(verificationResult: BankCheckVerificationResultFields, context: IContext) {
    // Only checking against address and company name scores as personal details score will always fail.
    if (
      !isNumber(verificationResult.addressScore) ||
      verificationResult.addressScore < context.config.options.bankCheckAddressScorePass ||
      !isNumber(verificationResult.companyNameScore) ||
      verificationResult.companyNameScore < context.config.options.bankCheckCompanyNameScorePass
    ) {
      return false;
    }
    if (this.partner.organisationType === "Industrial") {
      return verificationResult.regNumberScore && verificationResult.regNumberScore === "Match";
    }
    return true;
  }

  private validateRequest(originalDto: PartnerDto, partnerDocuments: DocumentSummaryDto[]) {
    if (!this.mergedPartner) {
      throw new BadRequestError("Request is missing required fields");
    }

    if (originalDto.partnerStatus !== PartnerStatus.Pending && this.validateBankDetails) {
      throw new BadRequestError("Cannot validate bank details for an active partner");
    }

    const validationResult = new PartnerDtoValidator(this.mergedPartner, originalDto, partnerDocuments, {
      showValidationErrors: true,
      validateBankDetails: this.validateBankDetails || this.verifyBankDetails,
    });

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }
  }
}
