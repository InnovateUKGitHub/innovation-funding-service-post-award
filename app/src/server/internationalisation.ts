import { CopyLanguages, CopyNamespaces } from "@copy/data";
import express from "express";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export const initInternationalisation = async () => {
  // initialize library
  await i18next.use(initReactI18next).init({
    lng: CopyLanguages.en_GB,
    fallbackLng: CopyLanguages.en_GB,
    defaultNS: CopyNamespaces.DEFAULT,
    fallbackNS: CopyNamespaces.DEFAULT,
    interpolation: {
      format: (value, format) => {
        if (typeof value === "string" && format === "lowercase") return value.toLocaleLowerCase();
        if (Array.isArray(value) && format === "arrayJoin") return value.join(", ");
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
