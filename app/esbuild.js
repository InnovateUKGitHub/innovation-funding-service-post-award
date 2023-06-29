#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention */

const { program, Option } = require("commander");
const { build } = require("esbuild");
const ESBuildConfiguration = require("./scripts/esbuild/ESBuildConfiguration");

const opts = program
  .option("--watch")
  .option("--tsc")
  .option("--devtools")
  .addOption(new Option("-t, --target <target>").choices(["acc", "updateSchema"]).makeOptionMandatory())
  .parse(process.argv)
  .opts();

const esbuildConfig = new ESBuildConfiguration(__dirname);
const restarter = esbuildConfig.getRestarter();
const shouldEnableDevTools = /^acc-dev|^acc-demo/.test(process.env.ENV_NAME) || process.env.NODE_ENV === "development";

if (opts.watch) {
  esbuildConfig.withWatch();
}

if (opts.tsc) {
  esbuildConfig.withTypecheck();
}

if (opts.devtools || shouldEnableDevTools) {
  esbuildConfig.withSourceMap();
}

switch (opts.target) {
  case "acc":
    // Build and bundle the server
    build(esbuildConfig.getServerConfig())
      .then(() => {
        // Create a server on first build.
        if (opts.watch) restarter.createServer();
      })
      .catch(() => process.exit(1));

    // Build and bundle the client
    build(esbuildConfig.getClientConfig()).catch(() => process.exit(1));
    break;
  case "updateSchema":
    build(esbuildConfig.getUpdateSchemaBuild()).catch(() => process.exit(1));
    break;
}
