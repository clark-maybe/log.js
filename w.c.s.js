const HTMLWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const path = require('path');
const packageJson = require('./package.json');

const version = packageJson['version'];

module.exports = {
    entry: {
        app: './src/index.ts'
    },
    plugins: [
        new WebpackBar({ name: 'log.js', color: '#52c41a' }),
        new HTMLWebpackPlugin({
            template: "./debugTool.html"
        })
    ],
    module: {
        rules: [
            { test: /\.js$/, loader: "babel-loader", options: { cacheDirectory: true }, exclude: /node_modules/ },
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    mode: 'development',
    resolve: {
        extensions: [".ts", ".js", ".json"]
    }
}
