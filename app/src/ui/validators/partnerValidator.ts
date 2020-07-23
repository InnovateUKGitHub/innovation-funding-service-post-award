import * as Validation from "./common";
import { Results } from "../validation/results";
import { PartnerDto, PartnerStatus } from "@framework/dtos";
import { Result } from "@ui/validation";

export class PartnerDtoValidator extends Results<PartnerDto> {

    constructor(
        model: PartnerDto,
        showValidationErrors: boolean,
        private readonly validateBankDetails?: boolean,
    ) {
        super(model, showValidationErrors);
    }

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

    public acountBuildingAndStreet = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.accountBuildingAndStreet, "Account building and street cannot be empty")
    ));

    public accountTownOrCity = this.conditionallyValidateBankDetails(() => Validation.all(this,
        () => Validation.required(this, this.model.accountTownOrCity, "Account town or city cannot be empty")
    ));

    public accountPostcode = this.conditionallyValidateBankDetails(() => Validation.required(this, this.model.accountPostcode, "Account postcode cannot be empty"));

    private conditionallyValidateBankDetails(test: () => Result) {
        if (!this.validateBankDetails) {
            return Validation.valid(this);
        }
        return test();
    }
}
