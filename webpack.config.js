const path = require('path');
//const entry = "./test/mini.config.js";
// const vue2 = "./test/vue2.config.js";
// const entry = './test/transform.js';
const entryIndex = './src/transform/src/index.js';
//const entry = './test/blog/index.js'

module.exports = {
    mode: 'development',
    entry: {
        index: entryIndex,
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
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
