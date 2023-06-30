enum SalesforceCompetitionTypes {
  unknown = "unknown",
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
  SalesforceCompetitionTypes.crnd,
  SalesforceCompetitionTypes.contracts,
  SalesforceCompetitionTypes.sbri,
  SalesforceCompetitionTypes.sbriIfs,
  SalesforceCompetitionTypes.ktp,
  SalesforceCompetitionTypes.catapults,
  SalesforceCompetitionTypes.loans,
  SalesforceCompetitionTypes.edge,
  SalesforceCompetitionTypes.horizonEurope,
];

const salesforceCompetitionTypesMap = [
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

const mapToSalesforceCompetitionTypes = (type: string): SalesforceCompetitionTypes => {
  switch (type) {
    case "CR&D":
      return SalesforceCompetitionTypes.crnd;
    case "CONTRACTS":
      return SalesforceCompetitionTypes.contracts;
    case "SBRI":
      return SalesforceCompetitionTypes.sbri;
    case "SBRI IFS":
      return SalesforceCompetitionTypes.sbriIfs;
    case "KTP":
      return SalesforceCompetitionTypes.ktp;
    case "CATAPULTS":
      return SalesforceCompetitionTypes.catapults;
    case "LOANS":
      return SalesforceCompetitionTypes.loans;
    case "EDGE":
      return SalesforceCompetitionTypes.edge;
    case "Horizon Europe Participation":
      return SalesforceCompetitionTypes.horizonEurope;
    default:
      return SalesforceCompetitionTypes.unknown;
  }
};

export {
  allSalesforceCompetitionTypes,
  salesforceCompetitionTypesMap,
  SalesforceCompetitionTypes,
  ImpactManagementParticipation,
  mapToSalesforceCompetitionTypes,
};
