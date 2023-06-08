import { BankCheckStatus } from "@framework/types";

export class BankCheckStatusMapper {
  private readonly options = {
    notValidated: "Not validated",
    validationPassed: "Validation passed",
    validationFailed: "Validation failed",
    verificationPassed: "Verification passed",
    verificationFailed: "Verification failed",
  };

  public mapFromSalesforce = (option: string | undefined): BankCheckStatus => {
    switch (option) {
      case this.options.notValidated:
        return BankCheckStatus.NotValidated;
      case this.options.validationPassed:
        return BankCheckStatus.ValidationPassed;
      case this.options.validationFailed:
        return BankCheckStatus.ValidationFailed;
      case this.options.verificationPassed:
        return BankCheckStatus.VerificationPassed;
      case this.options.verificationFailed:
        return BankCheckStatus.VerificationFailed;
      default:
        return BankCheckStatus.Unknown;
    }
  };

  public mapToSalesforce = (option: BankCheckStatus | undefined) => {
    switch (option) {
      case BankCheckStatus.NotValidated:
        return this.options.notValidated;
      case BankCheckStatus.ValidationPassed:
        return this.options.validationPassed;
      case BankCheckStatus.ValidationFailed:
        return this.options.validationFailed;
      case BankCheckStatus.VerificationPassed:
        return this.options.verificationPassed;
      case BankCheckStatus.VerificationFailed:
        return this.options.verificationFailed;
      default:
        return undefined;
    }
  };
}
