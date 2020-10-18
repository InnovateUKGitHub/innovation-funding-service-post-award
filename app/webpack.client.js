const webpack = require("webpack");
const path = require("path");

const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;

module.exports = function pack(env) {
  if (env !== "production" && env !== "development") {
    throw Error('Invalid env: Please use "development" or "production"');
  }

  process.env.BABEL_ENV = env;

  const appEntryPoint = path.resolve(__dirname, "src/client/client.tsx");
  const componentGuidesEntryPoint = path.resolve(__dirname, "src/client/componentsGuide.tsx");

  const buildOutput = path.resolve(__dirname, "public/build");

  const apiTargetFile = "apiClient.ts";
  const apiServerTarget = new RegExp(apiTargetFile);
  const apiClientTarget = path.resolve(__dirname, "src/client", apiTargetFile);

  // Note: For the client we swap the required file to client endpoints
  const ReplaceApiModule = new webpack.NormalModuleReplacementPlugin(apiServerTarget, apiClientTarget);

  return [
    {
      mode: env,
      entry: {
        bundle: ["isomorphic-fetch", appEntryPoint],
        componentsGuide: componentGuidesEntryPoint,
        vendor: ["react"],
      },
      node: {
        fs: "empty",
        net: "empty",
      },
      output: {
        filename: "[name].js",
        path: buildOutput,
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-react",
                "@babel/preset-typescript",
                [
                  "@babel/preset-env",
                  {
                    modules: false,
                    useBuiltIns: "usage",
                    corejs: "3.8",
                  },
                ],
              ],
              plugins: [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-transform-modules-commonjs",
                "@babel/plugin-proposal-class-properties",
              ],
              env: {
                production: {
                  plugins: ["transform-remove-console"],
                },
              },
            },
          },
          {
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader",
          },
        ],
      },
      optimization: {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: "all",
              name: "vendor",
              test: /[\\/]node_modules[\\/]/,
            },
          },
        },
      },
      resolve: {
        modules: ["node_modules"],
        extensions: [".tsx", ".ts", ".jsx", ".js"],
        plugins: [new TsConfigPathsPlugin()],
      },
      plugins: [ReplaceApiModule],
    },
  ];
};
