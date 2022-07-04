export enum PartnerClaimStatus {
  Unknown,
  NoClaimsDue,
  ClaimDue,
  ClaimsOverdue,
  ClaimQueried,
  ClaimSubmitted,
  IARRequired,
}

export enum PartnerStatus {
  Unknown,
  Active,
  OnHold,
  InvoluntaryWithdrawal,
  VoluntaryWithdrawal,
  Pending,
  MigratedWithdrawn,
}

export enum BankCheckStatus {
  Unknown = 0,
  NotValidated = 10,
  ValidationPassed = 20,
  ValidationFailed = 30,
  VerificationPassed = 40,
  VerificationFailed = 50,
}

export enum SpendProfileStatus {
  Unknown = 0,
  ToDo = 10,
  Incomplete = 20,
  Complete = 30,
}

export enum BankDetailsTaskStatus {
  Unknown = 0,
  ToDo = 10,
  Incomplete = 20,
  Complete = 30,
}

export enum PostcodeTaskStatus {
  Unknown = 0,
  ToDo = 10,
  Complete = 30,
}
