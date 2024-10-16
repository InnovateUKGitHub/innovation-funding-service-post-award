import "module-alias/register";
import "isomorphic-fetch";
import "isomorphic-form-data";
import "reflect-metadata";

import { Command } from "commander";
import { Server } from "./server";
import { healthCheck } from "./healthCheck";
import { configuration } from "./features/common/config";

// Set up New Relic to monitor app when deployed
if (configuration.newRelic.enabled) {
  setInterval(healthCheck, 60000);
}

interface CustomProcessArgs {
  secure?: boolean;
  dev?: boolean;
  port?: number;
}

const program = new Command();
program.option("--dev", "Enable development endpoints for use in esbuild", false);
program.parse();

const { dev } = program.opts() as CustomProcessArgs;

const server = new Server(dev ?? false);

// Use HTTPS if --secure flag set
server.start();
