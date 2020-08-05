// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
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
            loader: "awesome-typescript-loader"
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
      resolve: {
        modules: ['node_modules'],
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
        plugins: [ new TsConfigPathsPlugin() ],
      },
      plugins: [
        new webpack.NormalModuleReplacementPlugin(/apiClient\.ts/, "../client/apiClient.ts"),
        // new BundleAnalyzerPlugin({ analyzerMode: "static" })
      ]
    }
  ];
};
