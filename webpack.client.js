module.exports = [
    {
      entry: {
        client: './app/client/index.tsx',
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
      }
  }
];