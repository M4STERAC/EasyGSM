const path = require('path');

module.exports = {
  entry: './src/index.js', // Your entry point
  output: {
    filename: 'bundle.js', // Output bundle filename
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
};
