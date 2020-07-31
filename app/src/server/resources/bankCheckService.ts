import { Configuration, ConfigurationError } from "@server/features/common";
import {
  AccountDetails,
  BankCheckResult,
  BankCheckValidationResult,
  BankCheckVerificationResult,
  BankDetails
 } from "@framework/types/bankCheck";
import * as https from "https";

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

export interface IBankCheckService {
  validate(sortcode: string, accountNumber: string): Promise<BankCheckValidationResult>;
  verify(accountDetails: IVerifyBankCheckInputs): Promise<BankCheckVerificationResult>;
}

export class BankCheckService implements IBankCheckService {

  private getConnection() {
    if (!Configuration.sil.bankCheckUrl) {
      throw new ConfigurationError("Bank checking service not configured");
    }
    const bankCheckUrl = Configuration.sil.bankCheckUrl;
    return {bankCheckUrl};
  }

  public async validate(sortcode: string, accountNumber: string): Promise<BankCheckValidationResult> {
    const {bankCheckUrl} = this.getConnection();
    const bankDetails: BankDetails = {
      sortcode,
      accountNumber
    };

    return await this.getResult("/experianValidate", bankCheckUrl, bankDetails);
  }

  public async verify(accountDetails: IVerifyBankCheckInputs): Promise<BankCheckVerificationResult> {
    const {bankCheckUrl} = this.getConnection();

    return await this.getResult("/experianVerify", bankCheckUrl, accountDetails);
  }

  private async getResult<T extends BankDetails | AccountDetails, U extends BankCheckResult>(path: string, url: string, request: T): Promise<U> {
    const res: any = [];

    await this.makeApiCall(path, url, request)
      .then(response => {
        res.push(response);
      })
      .catch(error => {
        throw new Error(`request failed with ${error}`);
      });

    if (!res[0]) {
      throw new Error("Failed to get a response");
    }

    return res[0] as U;
  }

  private async makeApiCall<T extends BankDetails | AccountDetails, U extends BankCheckResult>(path: string, hostname: string, request: T): Promise<U> {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        hostname,
        path,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        maxRedirects: 20
      };
      const postData = JSON.stringify(request);
      const req = https.request(options, (res: any) => {
        const chunks: any = [];
        // reject on bad status
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error("statusCode=" + res.statusCode));
        }

        res.on("data", (chunk: any) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString());
            resolve(body);
          } catch (e) {
            reject(e.message);
          }
        });
      }).on("error", (e) => {
        reject(`Got error: ${e.message}`);
      });
      if (postData) {
        req.write(postData);
      }
      req.end();
    });
  }
}
