const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle filename
  },
  module: {
    rules: [
      {
        test: /\.json$/, // Apply the loader to .json files
        use: 'json-loader', // Loader to use
      },
      // Add more rules for other file types if needed
    ],
  },
};
