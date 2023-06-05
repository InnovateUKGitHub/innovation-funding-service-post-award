enum SalesforceCompetitionTypes {
  crnd = "CR&D",
  contracts = "CONTRACTS",
  sbri = "SBRI",
  sbriIfs = "SBRI IFS",
  ktp = "KTP",
  catapults = "CATAPULTS",
  loans = "LOANS",
  edge = "EDGE",
  horizonEurope = "Horizon Europe Participation",
}

enum ImpactManagementParticipation {
  Unknown = "Unknown",
  Yes = "Yes",
  No = "No",
}

const allSalesforceCompetitionTypes = [
  ["crnd", SalesforceCompetitionTypes.crnd],
  ["contracts", SalesforceCompetitionTypes.contracts],
  ["sbri", SalesforceCompetitionTypes.sbri],
  ["sbriIfs", SalesforceCompetitionTypes.sbriIfs],
  ["ktp", SalesforceCompetitionTypes.ktp],
  ["catapults", SalesforceCompetitionTypes.catapults],
  ["loans", SalesforceCompetitionTypes.loans],
  ["edge", SalesforceCompetitionTypes.edge],
  ["horizonEurope", SalesforceCompetitionTypes.horizonEurope],
] as const;

export { allSalesforceCompetitionTypes, SalesforceCompetitionTypes, ImpactManagementParticipation };
