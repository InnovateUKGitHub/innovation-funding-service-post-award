import "module-alias/register";
import "isomorphic-fetch";
import "isomorphic-form-data";
import { Command } from "commander";

import { Server } from "./server";
import { healthCheck } from "./healthCheck";

// Set up New Relic to monitor app when deployed
if (process.env.NEW_RELIC_ENABLED === "true") {
  require("newrelic");
  setInterval(healthCheck, 60000);
}

interface CustomProcessArgs {
  secure?: boolean;
  dev?: boolean;
  port?: number;
}

const program = new Command();
program.option("--secure", "Run in HTTPS mode");
program.option("--dev", "Enable development endpoints for use in esbuild", false);
program.parse(process.argv);

const { secure, dev } = program as CustomProcessArgs;

const port = parseInt(process.env.PORT ?? "8080", 10);
const development = dev || process.env.NODE_ENV === "development";

if (secure && process.env.SERVER_URL) {
  process.env.SERVER_URL = process.env.SERVER_URL.replace("http://", "https://");
}

const server = new Server(port, development);

// Use HTTPS if --secure flag set
server.start(!!secure);
