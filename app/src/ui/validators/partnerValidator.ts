import { PartnerDto } from "@framework/dtos";
import { Result } from "@ui/validation";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import {
  BankCheckStatus,
  BankDetailsTaskStatus,
  DocumentDescription,
  PartnerStatus,
  PostcodeTaskStatus,
  SpendProfileStatus,
} from "@framework/constants";
import { Results } from "../validation/results";
import * as Validation from "./common";

export class PartnerDtoValidator extends Results<PartnerDto> {
  constructor(
    model: PartnerDto,
    private readonly original: PartnerDto,
    private readonly partnerDocuments: DocumentSummaryDto[],
    private readonly options: {
      showValidationErrors: boolean;
      validateBankDetails?: boolean;
      failBankValidation?: boolean;
    },
  ) {
    super({ model, showValidationErrors: options.showValidationErrors });
  }

  private readonly allowedPartnerStatusTransitions: { [key: number]: PartnerStatus[] } = {
    [PartnerStatus.Pending]: [PartnerStatus.Pending, PartnerStatus.Active],
    [PartnerStatus.Active]: [PartnerStatus.Active],
    [PartnerStatus.InvoluntaryWithdrawal]: [PartnerStatus.InvoluntaryWithdrawal],
    [PartnerStatus.VoluntaryWithdrawal]: [PartnerStatus.VoluntaryWithdrawal],
    [PartnerStatus.OnHold]: [PartnerStatus.OnHold],
    [PartnerStatus.MigratedWithdrawn]: [PartnerStatus.MigratedWithdrawn],
  };

  private isPartnerStatusTransitionAllowed(original: PartnerDto, model: PartnerDto) {
    const allowedTransitions = this.allowedPartnerStatusTransitions[original.partnerStatus] || [];
    return allowedTransitions.indexOf(model.partnerStatus) >= 0;
  }

  private isBankCheckTaskStatusTransitionAllowed() {
    // If not changing status it's valid
    if (this.original.bankDetailsTaskStatus === this.model.bankDetailsTaskStatus) {
      return { isValid: true };
    }
    // If complete it can't regress
    if (this.original.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete) {
      return {
        isValid: this.model.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete,
        message: this.getContent(x => x.validation.partnerDtoValidator.bankDetailsStatusInvalidSubmitted),
      };
    }
    // If changing status to complete and the bank checks have not passed then a bank statement must be uploaded
    if (this.model.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete) {
      if (
        this.model.bankCheckStatus === BankCheckStatus.VerificationFailed ||
        this.model.bankCheckStatus === BankCheckStatus.ValidationFailed
      ) {
        return {
          isValid: this.partnerDocuments.some(x => x.description === DocumentDescription.BankStatement),
          message: this.getContent(x => x.validation.partnerDtoValidator.bankStatementRequired),
        };
      }
      return {
        isValid: this.model.bankCheckStatus === BankCheckStatus.VerificationPassed,
        message: this.getContent(x => x.validation.partnerDtoValidator.bankChecksRequired),
      };
    }
    return { isValid: true };
  }

  private validateBankDetailsTaskStatus() {
    const { isValid, message } = this.isBankCheckTaskStatusTransitionAllowed();
    return Validation.isTrue(this, isValid, message);
  }

  private validateForPartnerStatus(status: PartnerStatus, validation: () => Result) {
    if (this.original.partnerStatus !== status) return Validation.valid(this);
    return validation();
  }

  public partnerStatus = Validation.isTrue(
    this,
    this.isPartnerStatusTransitionAllowed(this.original, this.model),
    this.getContent(x => x.validation.partnerDtoValidator.partnerStatusChangeDisallowed),
  );

  public spendProfileStatus = this.validateForPartnerStatus(PartnerStatus.Pending, () =>
    Validation.isTrue(
      this,
      this.model.partnerStatus !== PartnerStatus.Active ||
        this.model.spendProfileStatus === SpendProfileStatus.Complete,
      this.getContent(x => x.validation.partnerDtoValidator.spendProfileRequired),
    ),
  );

  public bankDetailsTaskStatus = this.validateForPartnerStatus(PartnerStatus.Pending, () =>
    Validation.all(
      this,
      () =>
        Validation.isTrue(
          this,
          this.model.partnerStatus !== PartnerStatus.Active ||
            this.model.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete,
          this.getContent(x => x.validation.partnerDtoValidator.bankDetailsRequired),
        ),
      () => this.validateBankDetailsTaskStatus(),
    ),
  );

  public postcodeSetupStatus = this.validateForPartnerStatus(PartnerStatus.Pending, () =>
    Validation.isTrue(
      this,
      this.model.partnerStatus !== PartnerStatus.Active || !!this.model.postcode?.length,
      this.getContent(x => x.validation.partnerDtoValidator.projectLocationPostcodeRequired),
      "new-postcode",
    ),
  );

  public postcodeEditStatus = Validation.all(
    this,
    () =>
      this.model.postcodeStatus !== PostcodeTaskStatus.ToDo
        ? Validation.isTrue(
            this,
            !!this.model.postcode?.length,
            this.getContent(x => x.validation.partnerDtoValidator.projectLocationPostcodeRequired),
            "new-postcode",
          )
        : Validation.valid(this),
    () =>
      Validation.maxLength(
        this,
        this.model.postcode,
        10,
        this.getContent(x => x.validation.partnerDtoValidator.projectLocationPostcodeLengthTooLarge({ count: 10 })),
        "new-postcode",
      ),
  );

  public bankCheckValidation = this.conditionallyValidateBankDetails(() =>
    Validation.isFalse(
      this,
      !!this.options.failBankValidation,
      this.getContent(x => x.validation.partnerDtoValidator.bankChecksFailed),
    ),
  );

  public sortCode = this.conditionallyValidateBankDetails(
    () =>
      Validation.all(
        this,
        () =>
          Validation.required(
            this,
            this.model.bankDetails.sortCode,
            this.getContent(x => x.validation.partnerDtoValidator.sortCodeRequired),
          ),
        () =>
          Validation.sortCode(
            this,
            this.model.bankDetails.sortCode,
            this.getContent(x => x.validation.partnerDtoValidator.sortCodeInvalid),
          ),
      ),
    this.original.bankCheckStatus === BankCheckStatus.NotValidated,
  );

  public accountNumber = this.conditionallyValidateBankDetails(
    () =>
      Validation.all(
        this,
        () =>
          Validation.required(
            this,
            this.model.bankDetails.accountNumber,
            this.getContent(x => x.validation.partnerDtoValidator.accountNumberRequired),
          ),
        () =>
          Validation.accountNumber(
            this,
            this.model.bankDetails.accountNumber,
            this.getContent(x => x.validation.partnerDtoValidator.accountNumberInvalid),
          ),
      ),
    this.original.bankCheckStatus === BankCheckStatus.NotValidated,
  );

  private conditionallyValidateBankDetails(test: () => Result, condition = true) {
    if (condition && this.options.validateBankDetails) {
      return test();
    }
    return Validation.valid(this);
  }
}
