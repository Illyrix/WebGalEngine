//var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: ['babel-polyfill', './index.js'],
    output: {
        path: './bin',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /.js$/, loader: 'babel-loader', exclude: /node_modules/, }
        ]
    }
};