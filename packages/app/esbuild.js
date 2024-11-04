#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention */

const { program } = require("commander");
const { context } = require("esbuild");
const ESBuildConfiguration = require("./scripts/esbuild/ESBuildConfiguration");

const opts = program.option("--watch").option("--tsc").option("--devtools").parse(process.argv).opts();

const esbuildConfig = new ESBuildConfiguration(__dirname);
const restarter = esbuildConfig.getRestarter();
const shouldEnableDevTools = process.env.ACC_ENVIRONMENT !== "prod" || process.env.NODE_ENV === "development";

if (opts.watch) {
  esbuildConfig.withWatch();
}

if (opts.tsc) {
  esbuildConfig.withTypecheck();
}

if (opts.devtools || shouldEnableDevTools) {
  esbuildConfig.withSourceMap();
}

(async () => {
  const [server, client] = await Promise.all([
    context(esbuildConfig.getServerConfig()),
    context(esbuildConfig.getClientConfig()),
  ]);
  await Promise.all([server.rebuild(), client.rebuild()]);
  if (opts.watch) {
    await Promise.all([server.watch(), client.watch()]);
    await restarter.createServer();
  }

  await Promise.all([server.dispose(), client.dispose()]);
})();
