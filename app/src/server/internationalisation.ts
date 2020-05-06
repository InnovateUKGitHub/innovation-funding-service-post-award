import express from "express";
import i18next from "i18next";

export const initInternationalisation = async () => {
  // initialize library
  await i18next.init({
    lng: "en",
    fallbackLng: "en",
    defaultNS: "default",
    interpolation: {
      format: (value: string, format, lng) => {
        if (format === "lowercase") return value.toLocaleLowerCase();
        return value;
      }
    }
  });
};

export const internationalisationRouter = express.Router();

internationalisationRouter.get("/globalization/:lng", (req, res) => {
  const resource = i18next.getResourceBundle(req.params.lng, "default");
  res.status(200).send(resource);
});
