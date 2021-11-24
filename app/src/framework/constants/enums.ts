export enum ClaimFrequency {
  Unknown = 0,
  Monthly = 1,
  Quarterly = 3,
}

export enum ErrorCode {
  UNKNOWN_ERROR = 1,
  SECURITY_ERROR = 2,
  VALIDATION_ERROR = 3,
  REQUEST_ERROR = 4,
  BAD_REQUEST_ERROR = 5,
  FORBIDDEN_ERROR = 6,
  UNAUTHENTICATED_ERROR = 7,
  CONFIGURATION_ERROR = 8,
}

export enum PermissionGroupIdenfifier {
  Unknown = 0,
  ClaimsTeam = 1,
}

// This is not a complete list, just the ones we need to know about (e.g. to show certain fields for adding a partner pcr)
export enum CostCategoryType {
  Unknown = 0,
  Other_Funding = 3,
  Academic = 5,
  Labour = 10,
  Overheads = 20,
  Materials = 30,
  Capital_Usage = 40,
  Subcontracting = 50,
  Travel_And_Subsistence = 60,
  Other_Costs = 70,
}

export enum CostCategoryName {
  Other_Funding = "Other funding",
  Academic = "Academic",
  Labour = "Labour",
  Overheads = "Overheads",
  Materials = "Materials",
  Capital_Usage = "Capital usage",
  Subcontracting = "Subcontracting",
  Travel_And_Subsistence = "Travel and subsistence",
  Other_Costs = "Other costs",
  Other_Public_Sector_Funding = "Other public sector funding",
  VAT = "VAT",
}

export enum DateFormat {
  FULL_DATE,
  FULL_NUMERIC_DATE,
  SHORT_DATE,
  FULL_DATE_TIME,
  SHORT_DATE_TIME,
  SHORT_MONTH,
  DAY_AND_LONG_MONTH,
  LONG_YEAR,
  MONTH_YEAR,
}

export enum LogLevel {
  VERBOSE = 1,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export enum LoadingStatus {
  Preload = 1, // State before a request is made to the server, may have partial data.
  Loading = 2, // A request has been made to the server, waiting for data.
  Done = 3, // The server has responded, data ready to display.
  Failed = 4, // The server returned an error, data may be... in any state.
  Stale = 5, // The data is ready to display, but it is thought to be out of date.
  Updated = 6, // The data has been updated and is upto date
}
