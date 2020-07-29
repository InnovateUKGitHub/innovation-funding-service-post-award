import * as Validation from "./common";
import { Results } from "../validation/results";
import { BankDetailsTaskStatus, PartnerDto, PartnerStatus, SpendProfileStatus } from "@framework/dtos";
import { Result } from "@ui/validation";

export class PartnerDtoValidator extends Results<PartnerDto> {

    constructor(
        model: PartnerDto,
        private readonly original: PartnerDto,
        showValidationErrors: boolean,
        private readonly validateBankDetails?: boolean,
    ) {
        super(model, showValidationErrors);
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

    public partnerStatus = Validation.isTrue(this, this.isPartnerStatusTransitionAllowed(this.original, this.model), "Partner status change not allowed");
    public spendProfileStatus = Validation.isTrue(this, this.model.partnerStatus !== PartnerStatus.Active || this.model.spendProfileStatus === SpendProfileStatus.Complete, "You must complete your spend profile");
    public bankDetailsTaskStatus = Validation.isTrue(this, this.model.partnerStatus !== PartnerStatus.Active || this.model.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete, "You must provide your bank details");

    public postcode = this.model.partnerStatus === PartnerStatus.Active ? Validation.all(this,
        () => Validation.required(this, this.model.postcode, "Postcode field cannot be empty")
    ) : Validation.valid(this);

    public companyNumber = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.companyNumber, "Company number cannot be empty")
    ));

    public sortCode = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.sortCode, "Sort code cannot be empty"),
        () => Validation.sortCode(this, this.model.sortCode, "Please enter a valid sort code")
    ));

    public accountNumber = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.accountNumber, "Account number cannot be empty"),
        () => Validation.accountNumber(this, this.model.accountNumber, "Please enter a valid account number")
    ));

    public firstName = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.firstName, "First name cannot be empty")
    ));

    public lastName = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.lastName, "Last name cannot be empty")
    ));

    public accountStreet = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.accountStreet, "Account street cannot be empty")
    ));

    public accountTownOrCity = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.accountTownOrCity, "Account town or city cannot be empty")
    ));

    // TODO: Should these values be required?
    public accountBuilding = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.accountBuilding, "Account building name cannot be empty")
    ));

    public accountLocality = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.accountLocality, "Account locality cannot be empty")
    ));

    public accountPostcode = this.conditionallyValidateBankDetails(() => Validation.required(this, this.model.accountPostcode, "Account postcode cannot be empty"));

    private conditionallyValidateBankDetails(test: () => Result) {
        if (!this.validateBankDetails) {
            return Validation.valid(this);
        }
        return test();
    }
}
