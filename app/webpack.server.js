const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');

const flags = new webpack.DefinePlugin({
  __SERVER_ENV__: true
});

module.exports = [{
  mode: "development",
    entry: {
        server: './src/server/index.ts',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    devtool: 'source-map',
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
        ],
    },
    target: 'node',
    externals: [nodeExternals()],
    plugins: [flags],
  }
];
