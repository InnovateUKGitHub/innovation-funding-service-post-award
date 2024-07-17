import enCopy from "./default.en-GB.json";

import ktpEnCopy from "./ktp.en-GB.json";
import sbriEnCopy from "./sbri.en-GB.json";
import sbriIfsEnCopy from "./sbri-ifs.en-GB.json";
import loansEnCopy from "./loans.en-GB.json";
import horizonEuropeParticipationEnCopy from "./horizonEurope.en-GB.json";

enum CopyNamespaces {
  DEFAULT = "default",
  KTP = "ktp",
  LOANS = "loans",
  SBRI_IFS = "sbri-ifs",
  SBRI = "sbri",
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
  CopyNamespaces.SBRI_IFS,
  CopyNamespaces.SBRI,
  CopyNamespaces.HORIZON_EUROPE_PARTICIPATION,
] as const;

const allLanguages = [CopyLanguages.en_GB, CopyLanguages.ifspa_TEST];

export {
  enCopy,
  ktpEnCopy,
  sbriEnCopy,
  sbriIfsEnCopy,
  loansEnCopy,
  horizonEuropeParticipationEnCopy,
  CopyNamespaces,
  allNamespaces,
  CopyLanguages,
  allLanguages,
};
