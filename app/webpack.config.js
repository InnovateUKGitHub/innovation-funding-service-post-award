// @ts-check

/** @typedef {import('webpack').Configuration} Configuration */
/** @typedef {{ env: "production" | "development", devtools?: boolean }} Environment */

const path = require("path");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { NormalModuleReplacementPlugin, ProvidePlugin } = require("webpack");
const nodeExternals = require("webpack-node-externals");

/**
 * Get the path relative to __dirname
 *
 * @param {string} relativePath
 * @param {string} replacementPath
 */
const getPath = (relativePath, replacementPath = "") => path.resolve(__dirname, relativePath, replacementPath);

/**
 * Generate the regex/string pair to detect and then
 * replace files.
 *
 * @param {string} fileName
 * @returns {[RegExp, string]}
 */
const getNormalReplacementParams = fileName => [
  new RegExp(fileName),
  getPath("src/client/replacement-files", fileName),
];

/**
 * Generate both the client and server webpack configurations.
 * Can be used directly by Webpack - just export with `module.exports`
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 * @param { Environment } env
 * @returns { Configuration[] }
 * @example module.exports = configGenerator;
 */
const configGenerator = ({ env = "production", devtools = false }) => {
  /**
   * Development base configuration.
   * If the devtools are enabled, force our development mode on.
   *
   * This will override the mode in the commonConfig.
   *
   * @type { Configuration }
   */
  const developmentConfig = devtools
    ? {
        devtool: "source-map",
        mode: "development",
      }
    : {};

  /**
   * Common Webpack configuration.
   * This configuration is shared between client and server builds.
   *
   * @type { Configuration }
   */
  const commonConfig = {
    mode: env,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                url: {
                  filter: url => {
                    // If the url() references a file, don't resolve it.
                    if (url.includes(".png")) return false;
                    if (url.includes(".woff")) return false;
                    if (url.includes(".woff2")) return false;

                    return true;
                  },
                },
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.apex$/i,
          type: "asset/source",
        },
      ],
    },
    resolve: {
      modules: ["node_modules"],
      extensions: [".tsx", ".ts", ".jsx", ".js", ".css"],
      plugins: [new TsConfigPathsPlugin.TsconfigPathsPlugin()],
    },
    optimization: {
      minimizer: [
        "...",
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
    },
    ...developmentConfig,
  };

  /**
   * Client Webpack configuration
   *
   * @type { Configuration }
   */
  const clientConfig = {
    ...commonConfig,
    entry: {
      bundle: ["isomorphic-fetch", getPath("src/client/client.tsx"), getPath("src/styles/index.css")],
    },
    output: {
      filename: "[name].js",
      path: getPath("public/build"),
    },
    plugins: [
      new NormalModuleReplacementPlugin(...getNormalReplacementParams("apiClient.ts")),
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
      new ProvidePlugin({ React: "react" }),
    ],
    target: "web",
  };

  /**
   * Server Webpack configuration
   *
   * @type { Configuration }
   */
  const serverConfig = {
    ...commonConfig,
    entry: {
      bundle: [getPath("src/server/index.ts")],
    },
    output: {
      filename: "index.js",
      path: getPath("dist/src/server"),
    },
    plugins: [new ProvidePlugin({ React: "react" })],
    target: "node",
    externals: [nodeExternals()],
  };

  return [clientConfig, serverConfig];
};

module.exports = configGenerator;
