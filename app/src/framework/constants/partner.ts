export enum PartnerClaimStatus {
  Unknown = 0,
  NoClaimsDue = 1,
  ClaimDue = 2,
  ClaimsOverdue = 3,
  ClaimQueried = 4,
  ClaimSubmitted = 5,
  IARRequired = 6,
}

export enum PartnerStatus {
  Unknown = 0,
  Active = 1,
  OnHold = 2,
  InvoluntaryWithdrawal = 3,
  VoluntaryWithdrawal = 4,
  Pending = 5,
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
