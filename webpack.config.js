const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
    target: 'node',
    entry: {
        main: path.join(__dirname, 'src', 'index.js')
    },
    output: {
        filename: 'jdv.js',
        path: path.join(__dirname, '/build')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
        }]
    },
    externals: [
        nodeExternals()
    ]
};

module.exports = config;
