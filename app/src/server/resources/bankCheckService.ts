import { Configuration, ConfigurationError } from "@server/features/common";
import {
  AccountDetails,
  BankCheckCondition,
  BankCheckResult,
  BankCheckValidationResult,
  BankCheckVerificationResult,
  BankDetails
 } from "@framework/types/bankCheck";

export interface IVerifyBankCheckInputs {
  accountNumber: string;
  sortcode: string;
  companyName: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  organisation: string;
  buildingName: string;
  street: string;
  locality: string;
  town: string;
  postcode: string;
}

export interface IBankCheckService {
  validate(sortcode: string, accountNumber: string): Promise<BankCheckValidationResult>;
  verify(inputs: IVerifyBankCheckInputs): Promise<BankCheckVerificationResult>;
}

export class BankCheckService implements IBankCheckService {

  private getConnection() {
    if (!Configuration.sil.bankCheckValidateUrl || !Configuration.sil.bankCheckVerifyUrl) {
      throw new ConfigurationError("Bank checking service not configured");
    }
    const validateUrl = Configuration.sil.bankCheckValidateUrl;
    const verifyUrl = Configuration.sil.bankCheckVerifyUrl;
    return {validateUrl, verifyUrl};
  }

  public async validate(sortcode: string, accountNumber: string): Promise<BankCheckValidationResult> {
    const {validateUrl} = this.getConnection();
    const bankDetails: BankDetails = {
      sortcode,
      accountNumber
    };
    // tslint:disable-next-line: no-useless-cast
    return await this.makeApiCall("validate", validateUrl, bankDetails) as BankCheckValidationResult;
  }

  public async verify(inputs: IVerifyBankCheckInputs): Promise<BankCheckVerificationResult> {
    const {verifyUrl} = this.getConnection();
    const {
      accountNumber,
      sortcode,
      companyName,
      registrationNumber,
      firstName,
      lastName,
      organisation,
      buildingName,
      street,
      locality,
      town,
      postcode,
    } = inputs;

    const accountDetails: AccountDetails = {
      sortcode,
      accountNumber,
      companyName,
      registrationNumber,
      firstName,
      lastName,
      address: {
        organisation,
        buildingName,
        street,
        locality,
        town,
        postcode,
      }
    };

    // tslint:disable-next-line: no-useless-cast
    return await this.makeApiCall("verify", verifyUrl, accountDetails) as BankCheckVerificationResult;
  }

  private async makeApiCall<T extends BankDetails | AccountDetails,
    U extends BankCheckResult>(what: string, url: string, request: T): Promise<U> {
    const response = await fetch(url, {
      ...({
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      }), body: JSON.stringify(request)
    });
    if (!response.ok) {
      throw new Error(`SIL ${what} failed post request to ${url}`);
    }

    const result = await response.json() as U;

    const conditions = ([] as BankCheckCondition[]).concat(result.conditions || []);
    if (conditions.find(x => x.severity === "error")) {
      throw new Error(`SIL ${what} call returned error(s) ${JSON.stringify(conditions)}`);
    }

    return result;
  }
}
