import * as DotEnv from "dotenv";
DotEnv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "isomorphic-fetch";
import "isomorphic-form-data";

import { router as authRouter } from "./auth";
import { router } from "./router";
import { Logger } from "./features/common";

// Set up New Relic to monitor app when deployed
if(process.env.NEW_RELIC_ENABLED === "true") {
  require("newrelic"); // tslint:disable-line:no-var-requires
}

const app = express();
const port = process.env.PORT || 8080;
const log = new Logger();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  log.debug(req.url);
  next();
});

// un-authed routes
// serve the public folder contents
app.use(express.static("public"));
app.get("/api/health", (req, res) => res.send(true));

// auth handler
app.use(authRouter);

// all our defined routes
app.use(router);

app.listen(port);
