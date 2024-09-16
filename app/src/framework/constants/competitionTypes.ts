enum SalesforceCompetitionTypes {
  unknown = "unknown",
  crnd = "crnd",
  contracts = "contracts",
  sbri = "sbri",
  sbriIfs = "sbriIfs",
  ktp = "ktp",
  catapults = "catapults",
  loans = "loans",
  edge = "edge",
  horizonEurope = "horizonEurope",
  combinedCapital = "combinedCapital",
}

enum ImpactManagementParticipation {
  Unknown = "Unknown",
  Yes = "Yes",
  No = "No",
}

/**
 * What stage of Impact Management the project is in, if phased.
 */
enum ImpactManagementPhase {
  Unknown = "Unknown",
  First = "1st",
  Second = "2nd",
  Third = "3rd",
  Fourth = "4th",
  Fifth = "5th",
  Sixth = "6th",
  Last = "Last",
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
    case "Combined Capital":
      return SalesforceCompetitionTypes.combinedCapital;
    default:
      return SalesforceCompetitionTypes.unknown;
  }
};

export {
  allSalesforceCompetitionTypes,
  SalesforceCompetitionTypes,
  ImpactManagementParticipation,
  ImpactManagementPhase,
  mapToSalesforceCompetitionTypes,
};
