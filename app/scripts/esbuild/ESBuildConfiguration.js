/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-var-requires */
/** @typedef {import('esbuild').BuildOptions} BuildOptions */
require("dotenv").config();
const path = require("path");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const { typecheckPlugin } = require("@jgoz/esbuild-plugin-typecheck");
const replaceModulesPlugin = require("./replaceModulesPlugin");
const replaceGraphqlRelayPlugin = require("./replaceGraphqlRelayPlugin");
const Restarter = require("./Restarter");
const { execSync } = require("child_process");

class ESBuildConfiguration {
  /**
   * A server configuration for production builds.
   * Extensible to make suitable for development/watch modes.
   *
   * @type {BuildOptions}
   */
  serverBuild;

  /**
   * A client configuration for production builds.
   * Extensible to make suitable for development/watch modes.
   *
   * @type {BuildOptions}
   */
  clientBuild;

  /**
   * @type {Restarter}
   */
  restarter = new Restarter(process.env.SERVER_URL);

  /**
   * @type {string}
   */
  dirname;

  /**
   * Create a builder for generating esbuild configuration files.
   *
   * @param {string} dirname The __dirname of the `/esbuild.js` file.
   */
  constructor(dirname) {
    this.dirname = dirname;

    this.serverBuild = {
      entryPoints: [path.join(dirname, "src/server/index.ts")],
      platform: "node",
      format: "cjs",
      bundle: true,
      outdir: path.join(dirname, "dist/src/server"),
      minify: false,
      tsconfig: path.join(dirname, "tsconfig.json"),
      logLevel: "info",
      plugins: [nodeExternalsPlugin(), replaceGraphqlRelayPlugin],
      loader: {
        ".apex": "text",
        ".gql": "text",
        ".html": "text",
      },
    };

    this.clientBuild = {
      entryPoints: {
        bundle: path.join(dirname, "src/client/client.tsx"),
        styles: path.join(dirname, "src/styles/index.css"),
      },
      bundle: true,
      outdir: "public/build",
      minify: true,
      tsconfig: path.join(dirname, "tsconfig.json"),
      plugins: [replaceModulesPlugin, replaceGraphqlRelayPlugin],
      external: ["*.png", "*.woff2", "*.woff"],
      logLevel: "info",
    };
  }

  /**
   * Include the configuration options for enabling watch mode.
   *
   * @returns {ESBuildConfiguration} Itself
   */
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
          // Run relay
          execSync("npm run relay", { stdio: "inherit" });

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

  /**
   * Include the configuration options for enabling TypeScript checking.
   * The plugin used builds asynchronously on another thread, so regular
   * ESbuild speeds are not sacrificed.
   *
   * @returns {ESBuildConfiguration} Itself
   */
  withTypecheck() {
    this.serverBuild.plugins.push(typecheckPlugin());
    this.clientBuild.plugins.push(typecheckPlugin());

    return this;
  }

  /**
   * Include the IFS PA component library
   *
   * @returns {ESBuildConfiguration} Itself
   */
  withComponentLibrary() {
    this.clientBuild.entryPoints.componentsGuide = path.join(this.dirname, "src/client/componentsGuide.tsx");
    return this;
  }

  /**
   * Include sourcemap support
   *
   * @returns {ESBuildConfiguration} Itself
   */
  withSourceMap() {
    this.serverBuild.sourcemap = "linked";
    this.clientBuild.sourcemap = "linked";

    return this;
  }

  /**
   * Obtain the server build options.
   *
   * @returns {BuildOptions} Build options for the server-side component of IFS PA
   */
  getServerConfig() {
    return this.serverBuild;
  }

  /**
   * Obtain the client build options.
   *
   * @returns {BuildOptions} Build options for the client-side component of IFS PA
   */
  getClientConfig() {
    return this.clientBuild;
  }

  /**
   * Obtain the instance of the restarter module, which
   * allows you to restart/refresh the client/server.
   *
   * @returns {Restarter} An instance of the restarter
   */
  getRestarter() {
    return this.restarter;
  }
}

module.exports = ESBuildConfiguration;
