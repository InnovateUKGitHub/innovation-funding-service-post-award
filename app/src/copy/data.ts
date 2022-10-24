import enCopy from "./default.en-GB.json";

import ktpEnCopy from "./ktp.en-GB.json";
import sbriEnCopy from "./sbri.en-GB.json";
import sbriIfsEnCopy from "./sbri-ifs.en-GB.json";
import loansEnCopy from "./loans.en-GB.json";

enum CopyNamespaces {
  DEFAULT = "default",
  KTP = "ktp",
  LOANS = "loans",
  SBRI_IFS = "sbri-ifs",
  SBRI = "sbri",
}

enum CopyLanguages {
  en_GB = "en-GB",
}

const allNamespaces = [
  CopyNamespaces.DEFAULT,
  CopyNamespaces.KTP,
  CopyNamespaces.LOANS,
  CopyNamespaces.SBRI_IFS,
  CopyNamespaces.SBRI,
] as const;

const allLanguages = [CopyLanguages.en_GB];

export {
  enCopy,
  ktpEnCopy,
  sbriEnCopy,
  sbriIfsEnCopy,
  loansEnCopy,
  CopyNamespaces,
  allNamespaces,
  CopyLanguages,
  allLanguages,
};
