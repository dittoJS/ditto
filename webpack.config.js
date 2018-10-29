const path = require('path');

// const entry = "./src/transform/test/blog/mini.config.js";
const entry = './test/transform.js';

module.exports = {
  mode: 'development',
  entry: entry,
  output: {
    filename: "bundle.js",
    path: __dirname + "/build"
  },
  target: 'node',
  module: {
    rules: [
      { 
        test: /\.js$/, 
        use: "babel-loader",
        exclude: '/node_modules'
      }
    ]
  }
};