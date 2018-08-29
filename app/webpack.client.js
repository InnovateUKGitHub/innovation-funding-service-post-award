module.exports = [
    {
      node: {
        fs: 'empty',
        net: 'empty'
      },
      entry: {
        bundle: './src/client/client.tsx',
        componentsGuide: './src/client/componentsGuide.tsx',
      },
      output: {
        path: __dirname + '/public',
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