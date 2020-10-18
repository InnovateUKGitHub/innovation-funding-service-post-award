import * as DotEnv from "dotenv";
DotEnv.config();

import "module-alias/register";
import "isomorphic-fetch";
import "isomorphic-form-data";
import { Command } from "commander";

import { Server } from "./server";
import { healthCheck } from "./healthCheck";

// Set up New Relic to monitor app when deployed
if (process.env.NEW_RELIC_ENABLED === "true") {
  require("newrelic"); // tslint:disable-line:no-var-requires
  setInterval(healthCheck, 60000);
}

interface CustomProcessArgs {
  secure?: boolean;
}

const program = new Command();
program.option("--secure", "Run in HTTPS mode");
program.parse(process.argv);

const port = parseInt(process.env.PORT!, 10) || 8080;

const { secure } = program as CustomProcessArgs;

if (secure && process.env.SERVER_URL) {
  process.env.SERVER_URL = process.env.SERVER_URL.replace("http://", "https://");
}

const server = new Server(port);

// Use HTTPS if --secure flag set
server.start(!!secure);
