/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-var-requires */
const path = require("path");

const { NormalModuleReplacementPlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

/**
 *
 * @param {string} relativePath
 * @param {string} replacementPath
 */
const getPath = (relativePath, replacementPath = "") => path.resolve(__dirname, relativePath, replacementPath);

/**
 * @param {string} fileName
 * @returns {[RegExp, string]}
 */
const getNormalReplacementParams = fileName => [
  new RegExp(fileName),
  getPath("src/client/replacement-files", fileName),
];

module.exports = function pack(env) {
  if (env !== "production" && env !== "development") {
    throw Error('Invalid env: Please use "development" or "production"');
  }

  process.env.BABEL_ENV = env;

  const isDev = env === "development";
  const shouldEnableDevTools = /^acc-dev|^acc-demo/.test(process.env.ENV_NAME) || isDev;

  const appEntryPoint = getPath("src/client/client.tsx");
  const componentGuidesEntryPoint = getPath("src/client/componentsGuide.tsx");

  const configuration = {
    mode: env,
    entry: {
      bundle: ["isomorphic-fetch", appEntryPoint],
    },
    output: {
      filename: "[name].js",
      path: getPath("public/build"),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
        },
      ],
    },
    resolve: {
      modules: ["node_modules"],
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      plugins: [new TsConfigPathsPlugin()],
    },
    plugins: [
      new NormalModuleReplacementPlugin(...getNormalReplacementParams("dev-logger.ts")),
      new NormalModuleReplacementPlugin(...getNormalReplacementParams("apiClient.ts")),
    ].concat(isDev ? [new BundleAnalyzerPlugin()] : []),
  };

  if (shouldEnableDevTools) {
    configuration.entry.componentsGuide = componentGuidesEntryPoint;
    configuration.devtool = "source-map";
  }

  return [configuration];
};
