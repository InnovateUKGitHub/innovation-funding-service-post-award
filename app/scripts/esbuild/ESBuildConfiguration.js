/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars */

const path = require("path");
const { BuildOptions } = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const { typecheckPlugin } = require("@jgoz/esbuild-plugin-typecheck");
const replaceModulesPlugin = require("./replaceModulesPlugin");
const Restarter = require("./Restarter");

class ESBuildConfiguration {
  /**
   * A server configuration for production builds.
   * Extensible to make suitable for development/watch modes.
   *
   * @type {Partial<BuildOptions>}
   */
  serverBuild;

  /**
   * A client configuration for production builds.
   * Extensible to make suitable for development/watch modes.
   *
   * @type {Partial<BuildOptions>}
   */
  clientBuild;

  /**
   * @type {Restarter}
   */
  restarter = new Restarter(process.env.SERVER_URL);

  /**
   * Create a builder for generating esbuild configuration files.
   *
   * @param {string} dirname The __dirname of the `/esbuild.js` file.
   */
  constructor(dirname) {
    this.serverBuild = {
      entryPoints: [path.join(dirname, "src/server/index.ts")],
      platform: "node",
      format: "cjs",
      bundle: true,
      outdir: path.join(dirname, "dist/src/server"),
      minify: false,
      sourcemap: "external",
      tsconfig: path.join(dirname, "tsconfig.json"),
      logLevel: "info",
      plugins: [nodeExternalsPlugin()],
    };

    this.clientBuild = {
      entryPoints: {
        bundle: path.join(dirname, "src/client/client.tsx"),
        componentsGuide: path.join(dirname, "src/client/componentsGuide.tsx"),
      },
      bundle: true,
      outdir: "public/build",
      sourcemap: "linked",
      minify: true,
      tsconfig: path.join(dirname, "tsconfig.json"),
      plugins: [replaceModulesPlugin],
      loader: { ".png": "file", ".woff2": "file", ".woff": "file" },
      logLevel: "info",
    };
  }

  withWatch() {
    Object.assign(this.serverBuild, {
      watch: {
        onRebuild: () => {
          // On a rebuild, reload the server.
          this.getRestarter().reloadServer();
        },
      },
    });
    Object.assign(this.clientBuild, {
      watch: {
        onRebuild: () => {
          // On a rebuild, tell the client to reload.
          this.getRestarter().refreshClient();
        },
      },
      banner: {
        js: this.restarter.getClientBanner(),
      },
      minify: false,
    });

    return this;
  }

  withTypecheck() {
    this.serverBuild.plugins.push(typecheckPlugin());
    this.clientBuild.plugins.push(typecheckPlugin());

    return this;
  }

  getServerConfig() {
    return this.serverBuild;
  }

  getClientConfig() {
    return this.clientBuild;
  }

  getRestarter() {
    return this.restarter;
  }
}

module.exports = ESBuildConfiguration;
