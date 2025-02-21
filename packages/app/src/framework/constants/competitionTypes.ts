import { CopyNamespaces } from "@copy/data";
import type { ContentSelector } from "@copy/type";

enum SalesforceCompetitionTypes {
  unknown = "unknown",
  crnd = "crnd",
  contracts = "contracts",
  contractsForInnovation = "contractsForInnovation",
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
  SalesforceCompetitionTypes.contractsForInnovation,
  SalesforceCompetitionTypes.sbri,
  SalesforceCompetitionTypes.sbriIfs,
  SalesforceCompetitionTypes.ktp,
  SalesforceCompetitionTypes.catapults,
  SalesforceCompetitionTypes.loans,
  SalesforceCompetitionTypes.edge,
  SalesforceCompetitionTypes.horizonEurope,
  SalesforceCompetitionTypes.combinedCapital,
];

const mapToSalesforceCompetitionTypes = (type: string): SalesforceCompetitionTypes => {
  switch (type) {
    case "CR&D":
      return SalesforceCompetitionTypes.crnd;
    case "CONTRACTS":
      return SalesforceCompetitionTypes.contracts;
    case "Contracts for Innovation":
      return SalesforceCompetitionTypes.contractsForInnovation;
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

const mapSalesforceCompetitionTypeToCopy = (type: SalesforceCompetitionTypes): ContentSelector => {
  switch (type) {
    case SalesforceCompetitionTypes.crnd:
      return x => x.enums.competitionTypes.crnd;
    case SalesforceCompetitionTypes.contracts:
      return x => x.enums.competitionTypes.contracts;
    case SalesforceCompetitionTypes.sbri:
    case SalesforceCompetitionTypes.sbriIfs:
    case SalesforceCompetitionTypes.contractsForInnovation:
      return x => x.enums.competitionTypes.contractsForInnovation;
    case SalesforceCompetitionTypes.ktp:
      return x => x.enums.competitionTypes.ktp;
    case SalesforceCompetitionTypes.catapults:
      return x => x.enums.competitionTypes.catapults;
    case SalesforceCompetitionTypes.loans:
      return x => x.enums.competitionTypes.loans;
    case SalesforceCompetitionTypes.edge:
      return x => x.enums.competitionTypes.edge;
    case SalesforceCompetitionTypes.horizonEurope:
      return x => x.enums.competitionTypes.horizonEurope;
    case SalesforceCompetitionTypes.combinedCapital:
      return x => x.enums.competitionTypes.combinedCapital;
    case SalesforceCompetitionTypes.unknown:
      return x => x.enums.competitionTypes.unknown;
  }
};

const mapSalesforceCompetitionTypeToCopyCollection = (type: unknown): CopyNamespaces => {
  switch (type) {
    case "Contracts for Innovation":
    case "SBRI":
    case "SBRI IFS":
    case SalesforceCompetitionTypes.sbri:
    case SalesforceCompetitionTypes.sbriIfs:
    case SalesforceCompetitionTypes.contractsForInnovation:
      return CopyNamespaces.CONTRACTS_FOR_INNOVATION;
    case SalesforceCompetitionTypes.ktp:
    case "KTP":
      return CopyNamespaces.KTP;
    case SalesforceCompetitionTypes.loans:
    case "LOANS":
      return CopyNamespaces.LOANS;
    case SalesforceCompetitionTypes.horizonEurope:
    case "Horizon Europe Participation":
      return CopyNamespaces.HORIZON_EUROPE_PARTICIPATION;
    default:
      return CopyNamespaces.DEFAULT;
  }
};

export {
  allSalesforceCompetitionTypes,
  SalesforceCompetitionTypes,
  ImpactManagementParticipation,
  ImpactManagementPhase,
  mapToSalesforceCompetitionTypes,
  mapSalesforceCompetitionTypeToCopy,
  mapSalesforceCompetitionTypeToCopyCollection,
};
