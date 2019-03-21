import * as DotEnv from "dotenv";
DotEnv.config();

import cors from "cors";
import bodyParser from "body-parser";

import express, { NextFunction, Request, Response } from "express";
import "isomorphic-fetch";
import "isomorphic-form-data";

import { router as authRouter } from "./auth";
import { router } from "./router";
import { Configuration, Logger } from "./features/common";
import { allowCache, noCache} from "./cacheHeaders";

// Set up New Relic to monitor app when deployed
if (process.env.NEW_RELIC_ENABLED === "true") {
  require("newrelic"); // tslint:disable-line:no-var-requires
}

const app = express();
app.enable("trust proxy");
const port = process.env.PORT || 8080;
const log = new Logger();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  log.debug(req.url);
  next();
});

const setOwaspHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1");
  return next();
};

// un-authed routes
// serve the public folder contents
app.use(setOwaspHeaders, allowCache, express.static("public"));
app.get("/api/health", noCache, (req, res) => res.send(true));

// auth handler
app.use(authRouter);

// all our defined routes
app.use(setOwaspHeaders, noCache, router);

app.listen(port);

log.info(`Listening at ${process.env.SERVER_URL}`);
log.info("Configuration", Configuration);
