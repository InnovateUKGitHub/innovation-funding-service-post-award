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
}

export interface BankCheckValidationResultFields {
  readonly checkPassed: boolean;
  readonly iban: string | null;
  readonly conditions: BankCheckCondition;
}

export interface BankCheckValidationResult extends BankCheckResult {
  readonly ValidationResult: BankCheckValidationResultFields;
}

export interface BankCheckAddress {
  readonly organisation: string | null;
  readonly buildingName: string | null;
  readonly street: string | null;
  readonly locality: string | null;
  readonly town: string | null;
  readonly postcode: string | null;
}

export interface AccountDetails {
  readonly sortcode: string;
  readonly accountNumber: string;
  readonly companyName: string;
  readonly registrationNumber: string | null;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly address: BankCheckAddress;
}

type Score = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
type MatchFlag = "Match" | "No Match" | null;

export interface BankCheckVerificationResult extends BankCheckResult {
  readonly VerificationResult: BankCheckVerificationResultFields;
}

export interface BankCheckVerificationResultFields {
  readonly addressScore: Score;
  readonly companyNameScore: Score;
  readonly personalDetailsScore: Score;
  readonly regNumberScore: MatchFlag;
  readonly conditions: BankCheckCondition;
}
