export enum ProjectStatus {
  Unknown = 0,
  OfferLetterSent = 1,
  Live = 2,
  OnHold = 3,
  FinalClaim = 4,
  Closed = 5,
  Terminated = 6,
}

export enum ProjectSource {
  Unknown = "Unknown",
  Manual = "Manual",
  IFS = "IFS",
  Grants = "Grants",
}

export enum ProjectMonitoringLevel {
  Unknown = "Unknown",
  Platinum = "Platinum",
  Gold = "Gold",
  Silver = "Silver",
  Bronze = "Bronze",
  InternalAssurance = "InternalAssurance",
}

export enum ProjectRolePermissionBits {
  Unknown = 0,
  MonitoringOfficer = 1 << 0,
  ProjectManager = 1 << 1,
  FinancialContact = 1 << 2,
  Associate = 1 << 3,
}

export enum TypeOfAid {
  Unknown = 0,
  StateAid = 10,
  DeMinimisAid = 20,
}
