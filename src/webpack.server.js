const nodeExternals = require('webpack-node-externals');

module.exports = [{
    entry: {
        server: './app/server/index.ts',
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
}
];