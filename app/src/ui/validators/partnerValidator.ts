import * as Validation from "./common";
import { Results } from "../validation/results";
import { BankCheckStatus, BankDetailsTaskStatus, PartnerDto, PartnerStatus, SpendProfileStatus } from "@framework/dtos";
import { Result } from "@ui/validation";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants";

export class PartnerDtoValidator extends Results<PartnerDto> {

    constructor(
        model: PartnerDto,
        private readonly original: PartnerDto,
        private readonly partnerDocuments: DocumentSummaryDto[],
        private readonly options: {
            showValidationErrors: boolean,
            validateBankDetails?: boolean,
            failBankValidation?: boolean
        }
    ) {
        super(model, options.showValidationErrors);
    }

    private readonly allowedPartnerStatusTransitions: {[key: number]: PartnerStatus[]} = {
        [PartnerStatus.Pending]: [PartnerStatus.Pending, PartnerStatus.Active],
        [PartnerStatus.Active]: [PartnerStatus.Active],
        [PartnerStatus.InvoluntaryWithdrawal]: [PartnerStatus.InvoluntaryWithdrawal],
        [PartnerStatus.VoluntaryWithdrawal]: [PartnerStatus.VoluntaryWithdrawal],
        [PartnerStatus.OnHold]: [PartnerStatus.OnHold],
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
                message: "Bank details have already been completed"
            };
        }
        // If changing status to complete and the bank checks have not passed then a bank statement must be uploaded
        if (this.model.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete) {
            if (this.model.bankCheckStatus === BankCheckStatus.VerificationFailed || this.model.bankCheckStatus === BankCheckStatus.ValidationFailed) {
                return {
                    isValid: this.partnerDocuments.some(x => x.description === DocumentDescription.BankStatement),
                    message: "You must provide a bank statement"
                };
            }
            return {
                isValid: this.model.bankCheckStatus === BankCheckStatus.VerificationPassed,
                message: "Bank checks must be completed"
            };
        }
        return {isValid: true};
    }

    private validateBankDetailsTaskStatus() {
        const {isValid, message} = this.isBankCheckTaskStatusTransitionAllowed();
        return Validation.isTrue(this, isValid, message);
    }

    private validateForPartnerStatus(status: PartnerStatus, validation: () => Result) {
        if (this.original.partnerStatus !== status) return Validation.valid(this);
        return validation();
    }

    public partnerStatus = Validation.isTrue(this, this.isPartnerStatusTransitionAllowed(this.original, this.model), "Partner status change not allowed");

    public spendProfileStatus = this.validateForPartnerStatus(PartnerStatus.Pending, () =>
      Validation.isTrue(this, this.model.partnerStatus !== PartnerStatus.Active || this.model.spendProfileStatus === SpendProfileStatus.Complete, "You must complete your spend profile"));

    public bankDetailsTaskStatus = this.validateForPartnerStatus(PartnerStatus.Pending, () =>
      Validation.all(this,
        () => Validation.isTrue(this, this.model.partnerStatus !== PartnerStatus.Active || this.model.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete, "You must provide your bank details"),
        () => this.validateBankDetailsTaskStatus(),
      ));

    public postcode = this.model.partnerStatus === PartnerStatus.Active ? Validation.all(this,
        () => Validation.required(this, this.model.postcode, "Postcode field cannot be empty")
    ) : Validation.valid(this);

    public companyNumber = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.bankDetails.companyNumber, "Company number cannot be empty")
    ));

    public bankCheckValidation = this.conditionallyValidateBankDetails(() => Validation.isFalse(this, !!this.options.failBankValidation, "Check your sort code and account number."));

    public sortCode = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.bankDetails.sortCode, "Sort code cannot be empty"),
        () => Validation.sortCode(this, this.model.bankDetails.sortCode, "Please enter a valid sort code")
    ));

    public accountNumber = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.bankDetails.accountNumber, "Account number cannot be empty"),
        () => Validation.accountNumber(this, this.model.bankDetails.accountNumber, "Please enter a valid account number")
    ));

    public firstName = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.bankDetails.firstName, "First name cannot be empty")
    ));

    public lastName = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.bankDetails.lastName, "Last name cannot be empty")
    ));

    public accountStreet = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.bankDetails.address.accountStreet, "Account street cannot be empty")
    ));

    public accountTownOrCity = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.bankDetails.address.accountTownOrCity, "Account town or city cannot be empty")
    ));

    // TODO: Should these values be required?
    public accountBuilding = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.bankDetails.address.accountBuilding, "Account building name cannot be empty")
    ));

    public accountLocality = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.bankDetails.address.accountLocality, "Account locality cannot be empty")
    ));

    public accountPostcode = this.conditionallyValidateBankDetails(() => Validation.required(this, this.model.bankDetails.address.accountPostcode, "Account postcode cannot be empty"));

    private conditionallyValidateBankDetails(test: () => Result) {
        if (!this.options.validateBankDetails) {
            return Validation.valid(this);
        }
        return test();
    }
}
