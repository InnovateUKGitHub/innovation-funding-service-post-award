const path = require("path");

const NormalModuleReplacementPlugin = require("webpack").NormalModuleReplacementPlugin;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;

const getPath = (relativePath, replacementPath = "") => path.resolve(__dirname, relativePath, replacementPath);

// TODO: Create separate Webpack configs deriving from one base config (babel presets, etc...)
module.exports = function pack(env) {
  if (env !== "production" && env !== "development") {
    throw Error('Invalid env: Please use "development" or "production"');
  }

  process.env.BABEL_ENV = env;

  const isDev = env === "development";

  const appEntryPoint = getPath("src/client/client.tsx");
  const componentGuidesEntryPoint = getPath("src/client/componentsGuide.tsx");

  const buildOutput = getPath("public/build");

  const apiTargetFile = "apiClient.ts";
  const apiServerTarget = new RegExp(apiTargetFile);
  const apiClientTarget = getPath("src/client", apiTargetFile);

  const bundlerAnalyser = new BundleAnalyzerPlugin();
  // Note: For the client we swap the required file to client endpoints
  const replaceApiModule = new NormalModuleReplacementPlugin(apiServerTarget, apiClientTarget);

  const plugins = [replaceApiModule];

  if (isDev) {
    plugins.push(bundlerAnalyser);
  }

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
                [
                  "@babel/plugin-transform-react-jsx",
                  {
                    runtime: "automatic",
                  },
                ],
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
      plugins,
    },
  ];
};
