// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var webpack = require("webpack");

module.exports = function pack(env) {

  if (env !== "production" && env !== "development") {
    throw Error("Invalid env: Please use \"development\" or \"production\"");
  }

  process.env.BABEL_ENV = env;

  return [
    {
      mode: env,
      entry: {
        bundle: ["@babel/polyfill", "isomorphic-fetch", "./src/client/client.tsx"],
        componentsGuide: "./src/client/componentsGuide.tsx",
        vendor: ["react"],
      },
      node: {
        fs: "empty",
        net: "empty"
      },
      output: {
        path: __dirname + "/public/build",
        filename: "[name].js",
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
      devtool: "cheap-module-eval-source-map",
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-react",
                "@babel/preset-typescript",
                ["@babel/preset-env", {"modules": false}]
              ],
              env : {
                production: {
                  plugins: ["transform-remove-console"]
                }
              }
            }
          },
          {
            test: /\.tsx?$/,
            loader: "ts-loader"
          }
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
      plugins: [
        new webpack.NormalModuleReplacementPlugin(/apiClient\.ts/, "../client/apiClient.ts"),
        // new BundleAnalyzerPlugin({ analyzerMode: "static" })
      ]
    }
  ];
};
