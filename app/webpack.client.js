/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-var-requires */
const path = require("path");

const { NormalModuleReplacementPlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

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
  const appStylesEntryPoint = getPath("src/styles/index.css");
  const componentGuidesEntryPoint = getPath("src/client/componentsGuide.tsx");

  const configuration = {
    mode: env,
    entry: {
      bundle: ["isomorphic-fetch", appEntryPoint, appStylesEntryPoint],
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
      ],
    },
    resolve: {
      modules: ["node_modules"],
      extensions: [".tsx", ".ts", ".jsx", ".js", ".css"],
      plugins: [new TsConfigPathsPlugin()],
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
    plugins: [
      new NormalModuleReplacementPlugin(...getNormalReplacementParams("apiClient.ts")),
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
    ].concat(isDev ? [new BundleAnalyzerPlugin()] : []),
  };

  if (shouldEnableDevTools) {
    configuration.entry.componentsGuide = componentGuidesEntryPoint;
    configuration.devtool = "source-map";
  }

  return [configuration];
};
