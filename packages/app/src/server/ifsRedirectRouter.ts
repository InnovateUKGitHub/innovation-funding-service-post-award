import express from "express";
import { configuration } from "./features/common/config";

const ifsRedirectRouter = express.Router();

ifsRedirectRouter.get(["/login/reset-password", "/login/forgot-password", "/competition/*", "/info/*"], (req, res) => {
  const url = new URL(req.url, configuration.urls.ifsRoot);
  res.redirect(url.toString());
});

export { ifsRedirectRouter };
