//
// Request/response definitions for the SIL bank checks
//

export interface BankDetails {
  readonly sortcode: string;
  readonly accountNumber: string;
}

export interface BankCheckCondition {
  readonly severity: "error" | "warning" | "information";
  readonly code: number;
  readonly description: string;
}

export interface BankCheckResult {
  readonly conditions: BankCheckCondition | BankCheckCondition[] | undefined;
}

export interface BankCheckValidationResult extends BankCheckResult {
  readonly checkPassed: boolean;
  readonly iban: string | null;
}

export interface BankCheckAddress {
  readonly organisation: string;
  readonly buildingName: string;
  readonly street: string;
  readonly locality: string;
  readonly town: string;
  readonly postcode: string;
}

export interface AccountDetails {
  readonly sortcode: string;
  readonly accountNumber: string;
  readonly companyName: string;
  readonly registrationNumber: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly address: BankCheckAddress;
}

type Score = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
type MatchFlag = "Match" | "No Match" | null;

export interface BankCheckVerificationResult extends BankCheckResult {
  readonly addressScore: Score;
  readonly companyNameScore: Score;
  readonly personalDetailsScore: Score;
  readonly regNumberScore: MatchFlag;
}
