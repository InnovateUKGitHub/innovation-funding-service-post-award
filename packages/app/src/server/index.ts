import "isomorphic-fetch";
import "isomorphic-form-data";
import "reflect-metadata";

import moduleAlias from "module-alias";
import { Command } from "commander";
import { Server } from "./server";
import { healthCheck } from "./healthCheck";
import { configuration } from "./features/common/config";
import { Logger } from "@innovateuk/logger";

// Set up New Relic to monitor app when deployed
if (configuration.newRelic.enabled) {
  setInterval(healthCheck, 60000);
}

// Register import aliases
moduleAlias.addAliases({
  "@server": "dist/src/server",
  "@shared": "dist/src/shared",
  "@framework": "dist/src/framework",
  "@ui": "dist/src/ui",
  "@util": "dist/src/util",
  "@copy": "dist/src/copy",
  "@gql": "dist/src/gql",
});

Logger.setDefaultOptions({
  newRelic: configuration.newRelic.enabled,
  colourfulLogging: configuration.developer.colourfulLogging,
});

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
