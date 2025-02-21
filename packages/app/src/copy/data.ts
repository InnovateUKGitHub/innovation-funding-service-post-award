import enCopy from "./default.en-GB.json";

import ktpEnCopy from "./ktp.en-GB.json";
import contractsForInnovationEnCopy from "./contractsForInnovation.en-GB.json";
import loansEnCopy from "./loans.en-GB.json";
import horizonEuropeParticipationEnCopy from "./horizonEurope.en-GB.json";

enum CopyNamespaces {
  DEFAULT = "default",
  KTP = "ktp",
  LOANS = "loans",
  CONTRACTS_FOR_INNOVATION = "contracts-for-innovation",
  HORIZON_EUROPE_PARTICIPATION = "horizon-europe-participation",
}

enum CopyLanguages {
  en_GB = "en-GB",
  ifspa_TEST = "ifspa-TEST",
}

const allNamespaces = [
  CopyNamespaces.DEFAULT,
  CopyNamespaces.KTP,
  CopyNamespaces.LOANS,
  CopyNamespaces.CONTRACTS_FOR_INNOVATION,
  CopyNamespaces.HORIZON_EUROPE_PARTICIPATION,
] as const;

const allLanguages = [CopyLanguages.en_GB, CopyLanguages.ifspa_TEST];

export {
  enCopy,
  ktpEnCopy,
  contractsForInnovationEnCopy,
  loansEnCopy,
  horizonEuropeParticipationEnCopy,
  CopyNamespaces,
  allNamespaces,
  CopyLanguages,
  allLanguages,
};
