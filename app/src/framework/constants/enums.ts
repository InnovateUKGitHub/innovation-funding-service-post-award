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
  SFDC_ERROR = 9,
}

export enum SalesforceStatusCode {
  SF_UPDATE_ALL_FAILURE = "SF_UPDATE_ALL_FAILURE",
  INSUFFICIENT_ACCESS_OR_READONLY = "INSUFFICIENT_ACCESS_OR_READONLY",
  NOT_UPLOADED_FROM_OWNER = "NOT_UPLOADED_FROM_OWNER",
  STRING_TOO_LONG = "STRING_TOO_LONG",
  INVALID_CROSS_REFERENCE_KEY = "INVALID_CROSS_REFERENCE_KEY",
}

export enum DetailedErrorCode {
  ACC_VALIDATION_ERROR = "ACC_VALIDATION_ERROR",
  ACC_GRAPHQL_ERROR = "ACC_GRAPHQL_ERROR",
  SFDC_DEFAULT_STACKTRACE = "SFDC_DEFAULT_STACKTRACE",
  SFDC_CANNOT_USE_RECORD_TYPE = "SFDC_CANNOT_USE_RECORD_TYPE",
  SFDC_STRING_TOO_LONG = "SFDC_STRING_TOO_LONG",
  SFDC_SF_UPDATE_ALL_FAILURE = "SFDC_SF_UPDATE_ALL_FAILURE",
  SFDC_INSUFFICIENT_ACCESS_OR_READONLY = "SFDC_INSUFFICIENT_ACCESS_OR_READONLY",
  SFDC_NOT_UPLOADED_FROM_OWNER = "SFDC_NOT_UPLOADED_FROM_OWNER",
  SFDC_FIELD_CUSTOM_VALIDATION_EXCEPTION = "SFDC_FIELD_CUSTOM_VALIDATION_EXCEPTION",
}

export enum SfdcFieldCustomValidationException {
  UNKNOWN_ERROR = "UNKNOWN",
  CLAIM_MISSING_AWARD_RATE = "CLAIM_MISSING_AWARD_RATE",
}

export enum PermissionGroupIdentifier {
  Unknown = 0,
  ClaimsTeam = 1,
}

// A list of all Salesforce cost category types.
// See "/app/src/framework/types/CostCategory.ts" for their
// corresponding names and guidance texts.
export enum CostCategoryType {
  Unknown,
  Other_Funding,
  Academic,
  Labour,
  Indirect_Costs,
  Overheads,
  Materials,
  Capital_Usage,
  Subcontracting,
  Travel_And_Subsistence,
  Other_Costs,
  Other_Public_Sector_Funding,
  VAT,
  Advance_on_Grant,
  Capital_Equipment,
  Capitalised_Labour,
  Other_Costs_Resource,
  Other_Costs_Capital,
  Property_Capital,
  Property_Revenue,
  Other_Costs_2,
  Other_Costs_3,
  Other_Costs_4,
  Other_Costs_5,
  Additional_associate_support,
  Associate_development,
  Associate_Employment,
  Consumables,
  Estate,
  Indirect_costs,
  Knowledge_base_supervisor,
  Loans_costs_for_Industrial_participants,

  Research_and_Development_Labour,
  Research_and_Development_Overheads,
  Research_and_Development_Materials,
  Research_and_Development_Subcontracting,
  Research_and_Development_Travel_And_Subsistence,
  Research_and_Development_Capital_Usage,
  Research_and_Development_Other_Costs,
}

export enum CostCategoryGroupType {
  Academic,
  Labour,
  Overheads,
  Materials,
  Subcontracting,
  Capital_Usage,
  Travel_And_Subsistence,
  Other_Costs,
  Other_Funding,
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
  SHORT_MONTH_YEAR,
}

export enum LogLevel {
  TRACE = "TRACE",
  VERBOSE = "VERBOSE",
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export enum LoadingStatus {
  Preload = 1, // State before a request is made to the server, may have partial data.
  Loading = 2, // A request has been made to the server, waiting for data.
  Done = 3, // The server has responded, data ready to display.
  Failed = 4, // The server returned an error, data may be... in any state.
  Stale = 5, // The data is ready to display, but it is thought to be out of date.
  Updated = 6, // The data has been updated and is upto date
}

export enum AccEnvironment {
  BASE = "base",
  AT = "at",
  CUSTOM = "custom",
  DEMO = "demo",
  DEV = "dev",
  PERF = "perf",
  PREPROD = "preprod",
  PROD = "prod",
  SYSINT = "sysint",
  UAT = "uat",
  LOCAL = "local",
  CAPDEV = "capdev",

  UNKNOWN = "",
}
