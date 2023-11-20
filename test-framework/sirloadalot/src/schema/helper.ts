type CompetitionType =
  | "CR&D"
  | "CONTRACTS"
  | "SBRI"
  | "KTP"
  | "CATAPULTS"
  | "LOANS"
  | "SBRI IFS"
  | "EDGE";

interface Lookup<T> {
  lookup: T;
}

export { CompetitionType, Lookup };
