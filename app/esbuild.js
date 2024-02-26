#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention */

const { program, Option } = require("commander");
const { build, context } = require("esbuild");
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
  switch (opts.target) {
    case "acc":
      const [server, client] = await Promise.all([
        context(esbuildConfig.getServerConfig()),
        context(esbuildConfig.getClientConfig()),
      ]);

      if (opts.watch) {
        await Promise.all([server.watch(), client.watch()]);
        while (1) {
          await restarter.createServer();
        }
      } else {
        await Promise.all([server.rebuild(), client.rebuild()]);
        await Promise.all([server.dispose(), client.dispose()]);
      }

      break;
    case "updateSchema":
      build(esbuildConfig.getUpdateSchemaBuild());
      break;
  }
})();
