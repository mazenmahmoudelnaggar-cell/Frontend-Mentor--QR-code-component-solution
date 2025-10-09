const autoprefixer = require('autoprefixer');

module.exports = {
  parser: 'postcss-safe-parser',
  map: false, // disables inline source maps
  plugins: [
    autoprefixer(), // enables Autoprefixer
  ],
};