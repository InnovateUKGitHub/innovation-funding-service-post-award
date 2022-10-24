import { CopyLanguages, CopyNamespaces } from "@copy/data";
import express from "express";
import i18next from "i18next";

export const initInternationalisation = async () => {
  // initialize library
  await i18next.init({
    lng: CopyLanguages.en_GB,
    fallbackLng: CopyLanguages.en_GB,
    defaultNS: CopyNamespaces.DEFAULT,
    fallbackNS: CopyNamespaces.DEFAULT,
    interpolation: {
      format: (value: string, format) => {
        if (format === "lowercase") return value.toLocaleLowerCase();
        return value;
      },
    },
  });
};

export const internationalisationRouter = express.Router();

internationalisationRouter.get("/internationalisation/:locale/:namespace", (req, res) => {
  const resource = i18next.getResourceBundle(req.params.locale, req.params.namespace);
  res.status(200).send(resource);
});
