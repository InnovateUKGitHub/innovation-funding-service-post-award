import { CopyLanguages, CopyNamespaces } from "@copy/data";
import i18next, { ResourceKey } from "i18next";

const testInitialiseInternationalisation = <T extends ResourceKey>(
  copy: T,
  additionalCopy?: { [key: string]: ResourceKey },
) => {
  return i18next.init({
    lng: CopyLanguages.en_GB,
    ns: CopyNamespaces.DEFAULT,
    fallbackLng: CopyLanguages.en_GB,
    fallbackNS: CopyNamespaces.DEFAULT,
    resources: {
      [CopyLanguages.en_GB]: {
        [CopyNamespaces.DEFAULT]: copy,
        ...additionalCopy,
      },
    },
  });
};

export { testInitialiseInternationalisation };
