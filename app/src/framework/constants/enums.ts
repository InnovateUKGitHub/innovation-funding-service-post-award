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

export enum CostCategoryInputType {
  Labour,
  Overheads,
  Materials,
  Subcontracting,
  Capital_Usage,
  Travel_And_Subsistence,
  Other_Costs,
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
