const path = require('path');

const mini = "./test/mini.config.js";
const vue2 = "./test/vue2.config.js";
// const entry = './test/transform.js';

module.exports = {
  mode: 'development',
  entry: {
    mini,
    vue2
  },
  output: {
    filename: "[name].js",
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