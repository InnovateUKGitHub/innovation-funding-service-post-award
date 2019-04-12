import * as DotEnv from "dotenv";
DotEnv.config();

import "module-alias/register";
import "isomorphic-fetch";
import "isomorphic-form-data";

import { Server } from "./server";
import { healthCheck } from "./healthCheck";

// Set up New Relic to monitor app when deployed
if (process.env.NEW_RELIC_ENABLED === "true") {
  require("newrelic"); // tslint:disable-line:no-var-requires
  setInterval(healthCheck, 60000);
}

const port = parseInt(process.env.PORT!, 10) || 8080;
const server = new Server(port);
server.start();
