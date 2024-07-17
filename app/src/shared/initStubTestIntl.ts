import {
  CopyLanguages,
  CopyNamespaces,
  enCopy,
  ktpEnCopy,
  loansEnCopy,
  sbriEnCopy,
  sbriIfsEnCopy,
  horizonEuropeParticipationEnCopy,
} from "@copy/data";
import { i18nInterpolationOptions, registerIntlFormatter } from "@copy/interpolation";
import i18next, { ResourceKey } from "i18next";
import { initReactI18next } from "react-i18next";

const initStubTestIntl = <T extends ResourceKey = AnyObject>(
  copy?: T,
  additionalCopy?: { [key: string]: ResourceKey },
) => {
  return i18next.use(initReactI18next).init({
    lng: CopyLanguages.en_GB,
    ns: CopyNamespaces.DEFAULT,
    fallbackLng: CopyLanguages.en_GB,
    fallbackNS: CopyNamespaces.DEFAULT,
    resources: {
      [CopyLanguages.en_GB]: {
        [CopyNamespaces.DEFAULT]: copy ?? {},
        ...additionalCopy,
      },
    },
  });
};

const initFullTestIntl = async () => {
  await i18next.use(initReactI18next).init({
    lng: CopyLanguages.en_GB,
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

export { initStubTestIntl, initFullTestIntl };
