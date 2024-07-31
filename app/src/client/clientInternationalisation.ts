import i18next from "i18next";

import {
  CopyLanguages,
  CopyNamespaces,
  enCopy,
  horizonEuropeParticipationEnCopy,
  ktpEnCopy,
  loansEnCopy,
  sbriEnCopy,
  sbriIfsEnCopy,
} from "@copy/data";
import { i18nInterpolationOptions, registerIntlFormatter } from "@copy/interpolation";
import { initReactI18next } from "react-i18next";

const clientInternationalisation = async (language: CopyLanguages) => {
  await i18next.use(initReactI18next).init({
    lng: language,
    fallbackLng: {
      en: ["en-GB"],
    },
    defaultNS: CopyNamespaces.DEFAULT,
    fallbackNS: CopyNamespaces.DEFAULT,
    interpolation: i18nInterpolationOptions,
    resources: {
      [CopyLanguages.en_GB]: {
        [CopyNamespaces.DEFAULT]: enCopy,
        [CopyNamespaces.KTP]: ktpEnCopy,
        [CopyNamespaces.LOANS]: loansEnCopy,
        [CopyNamespaces.SBRI_IFS]: sbriEnCopy,
        [CopyNamespaces.SBRI]: sbriIfsEnCopy,
        [CopyNamespaces.HORIZON_EUROPE_PARTICIPATION]: horizonEuropeParticipationEnCopy,
      },
    },
  });

  registerIntlFormatter();
};

export { clientInternationalisation };
