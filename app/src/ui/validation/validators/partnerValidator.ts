import { DocumentDescription } from "@framework/constants/documentDescription";
import {
  PartnerStatus,
  BankDetailsTaskStatus,
  BankCheckStatus,
  SpendProfileStatus,
  PostcodeTaskStatus,
} from "@framework/constants/partner";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Result } from "@ui/validation/result";
import { Results } from "../results";
import * as Validation from "./common";
import { ProjectSource } from "@framework/constants/project";

export class PartnerDtoValidator extends Results<PartnerDto> {
  constructor(
    model: PartnerDto,
    private readonly original: PartnerDto,
    private readonly partnerDocuments: DocumentSummaryDto[],
    private readonly options: {
      showValidationErrors: boolean;
      validateBankDetails?: boolean;
      failBankValidation?: boolean;
      projectSource?: ProjectSource;
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
      this.getContent(x => x.forms.partnerDetailsEdit.postcode.errors.too_small),
      "postcode",
    ),
  );

  public postcodeEditStatus = Validation.all(
    this,
    () =>
      this.model.postcodeStatus !== PostcodeTaskStatus.ToDo
        ? Validation.isTrue(
            this,
            this.model.partnerStatus !== PartnerStatus.Active || !!this.model.postcode?.length,
            this.getContent(x =>
              x.forms.errors.generic.textarea.required({
                label: this.getContent(x => x.forms.partnerDetailsEdit.postcode.label),
              }),
            ),
            "postcode",
          )
        : Validation.valid(this),
    () =>
      Validation.maxLength(
        this,
        this.model.postcode,
        10,
        this.getContent(x =>
          x.forms.errors.generic.textarea.too_big({
            label: this.getContent(x => x.forms.partnerDetailsEdit.postcode.label),
          }),
        ),
        "postcode",
      ),
  );

  public bankCheckValidation = this.conditionallyValidateBankDetails(() =>
    Validation.isFalse(
      this,
      !!this.options.failBankValidation,
      this.getContent(x => x.validation.partnerDtoValidator.bankChecksFailed),
      "bankCheckValidation",
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
            "sortCode",
          ),
        () =>
          Validation.sortCode(
            this,
            this.model.bankDetails.sortCode,
            this.getContent(x => x.validation.partnerDtoValidator.sortCodeInvalid),
            "sortCode",
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
            "accountNumber",
          ),
        () =>
          Validation.accountNumber(
            this,
            this.model.bankDetails.accountNumber,
            this.getContent(x => x.validation.partnerDtoValidator.accountNumberInvalid),
            "accountNumber",
          ),
      ),
    this.original.bankCheckStatus === BankCheckStatus.NotValidated,
  );

  public manualProjectSetup =
    this.options.projectSource === "Manual"
      ? this.validateForPartnerStatus(PartnerStatus.Pending, () =>
          Validation.inValid(
            this,
            this.getContent(x => x.validation.partnerDtoValidator.partnerStatusChangeDisallowed),
          ),
        )
      : Validation.valid(this);

  private conditionallyValidateBankDetails(test: () => Result, condition = true) {
    if (condition && this.options.validateBankDetails) {
      return test();
    }
    return Validation.valid(this);
  }
}
