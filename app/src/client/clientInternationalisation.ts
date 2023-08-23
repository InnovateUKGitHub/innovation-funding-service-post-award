import i18next from "i18next";

import { allNamespaces, CopyLanguages, CopyNamespaces } from "@copy/data";
import { i18nInterpolationOptions, registerIntlFormatter } from "@copy/interpolation";
import { initReactI18next } from "react-i18next";
import { Logger } from "@shared/developmentLogger";

const logger = new Logger("Client Internationalisation");

const loadLanguage = async (language: string, namespace: string) => {
  const copy = await fetch(`/internationalisation/${language}/${namespace}`).then(res => res.text());

  try {
    const data = JSON.parse(copy);
    i18next.addResourceBundle(language, namespace, data, true, true);
    logger.debug("Successfully loaded i18n locale", language, namespace);
  } catch {
    logger.error("Failed to parse i18n locale", language, namespace);
    i18next.addResourceBundle(language, namespace, {}, true, true);
  }
};

const clientInternationalisation = async (language: CopyLanguages) => {
  await i18next.use(initReactI18next).init({
    lng: language,
    fallbackLng: {
      en: ["en-GB"],
    },
    defaultNS: CopyNamespaces.DEFAULT,
    fallbackNS: CopyNamespaces.DEFAULT,
    interpolation: i18nInterpolationOptions,
  });

  registerIntlFormatter();

  const promises = [];

  for (const namespace of allNamespaces) {
    const promise = loadLanguage(i18next.language, namespace);
    promises.push(promise);
  }

  await Promise.all(promises);
};

export { clientInternationalisation };
