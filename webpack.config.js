const path = require('path');
const entry = "./test/mini.config.js";
// const vue2 = "./test/vue2.config.js";
// const entry = './test/transform.js';
// const entry = './src/transform/src/index.js';
//const entry = './test/blog/index.js'

module.exports = {
    mode: 'development',
    entry: entry,
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(js)x?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};
