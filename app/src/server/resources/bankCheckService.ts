import {
  AccountDetails,
  BankCheckResult,
  BankCheckValidationResult,
  BankCheckVerificationResult,
  BankDetails,
} from "@framework/types/bankCheck";
import { configuration } from "@server/features/common/config";
import { BadRequestError, ConfigurationError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";

export interface IVerifyBankCheckInputs {
  companyName: string;
  registrationNumber: string | null;
  sortcode: string;
  accountNumber: string;
  firstName: string | null;
  lastName: string | null;
  address: {
    organisation: string | null;
    buildingName: string | null;
    street: string | null;
    locality: string | null;
    town: string | null;
    postcode: string | null;
  };
}

export class BankCheckService {
  private logger: Logger = new Logger("BankCheckService");

  /**
   * Ensure that input does not have masking characters, like those
   * generated and included by Salesforce.
   *
   * @param sortcode The user's sort code
   * @param accountNumber The user's account number
   */
  public checkForUnmaskedInput(sortcode: string, accountNumber: string): void {
    if (sortcode.toLowerCase().includes("x")) {
      throw new BadRequestError("Sort code includes masking characters");
    }
    if (accountNumber.toLowerCase().includes("x")) {
      throw new BadRequestError("Account number includes masking characters");
    }
  }

  public async validate(sortcode: string, accountNumber: string): Promise<BankCheckValidationResult> {
    this.checkForUnmaskedInput(sortcode, accountNumber);
    return await this.fetchBankQuery<BankDetails, BankCheckValidationResult>("/experianValidate", {
      sortcode,
      accountNumber,
    });
  }

  public async verify(accountDetails: IVerifyBankCheckInputs): Promise<BankCheckVerificationResult> {
    this.checkForUnmaskedInput(accountDetails.sortcode, accountDetails.accountNumber);
    return await this.fetchBankQuery<AccountDetails, BankCheckVerificationResult>("/experianVerify", accountDetails);
  }

  private async fetchBankQuery<T extends BankDetails | AccountDetails, U extends BankCheckResult>(
    path: string,
    payload: T,
  ): Promise<U> {
    const { bankCheckUrl } = configuration.sil;

    if (!bankCheckUrl) {
      throw new ConfigurationError("Bank checking service not configured");
    }

    const request = await fetch(`${bankCheckUrl}${path}`, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      compress: false, // Note: This allows 'Accept-Encoding' to be overridden, SIL only allows 'zip'
      method: "POST",
      headers: {
        "Accept-Encoding": "zip",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (request.ok) {
      return await request.json();
    } else {
      this.logger.debug("Failed querying Experian via SIL", `${bankCheckUrl}${path}`, payload, await request.json());
      throw Error("Failed querying Experian via SIL");
    }
  }
}

export type IBankCheckService = Pick<BankCheckService, "validate" | "verify">;
