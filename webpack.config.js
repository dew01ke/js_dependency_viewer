const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
    target: 'node',
    entry: {
        main: path.join(__dirname, 'src', 'index.js')
    },
    output: {
        filename: 'jdv.js',
        path: path.join(__dirname, '/bin')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
        }]
    },
    externals: [
        nodeExternals()
    ],
    plugins: [
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node\r\n\r\n',
            raw: true
        })
    ]
};

module.exports = config;
