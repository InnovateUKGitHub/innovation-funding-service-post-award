export enum ProjectStatus {
  Unknown = 0,
  OfferLetterSent = 1,
  Live = 2,
  OnHold = 3,
  FinalClaim = 4,
  Closed = 5,
  Terminated = 6,
}

export enum ProjectMonitoringLevel {
  Unknown = "unknown",
  Platinum = "platinum",
  Gold = "gold",
  Silver = "silver",
  Bronze = "bronze",
  InternalAssurance = "internalAssurance",
}

export enum ProjectRole {
  Unknown = 0,
  MonitoringOfficer = 1 << 0,
  ProjectManager = 1 << 1,
  FinancialContact = 1 << 2,
}

export enum TypeOfAid {
  Unknown = 0,
  StateAid = 10,
  DeMinimisAid = 20,
}
