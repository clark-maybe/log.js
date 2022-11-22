const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: "./debugTool.html",
            filename: "debugTool.html"
        }),
        new UglifyJsPlugin({
            uglifyOptions:{
                compress:{
                    drop_console:false
                }
            },
            sourceMap:true,
            parallel:true
        })
    ],
    module: {
        rules: [
            { test: /\.js$/, loader: "babel-loader", options: { cacheDirectory: true }, exclude: /node_modules/ },
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    mode: 'production',
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    output: {
        filename: `log.min.js`,
        path: path.resolve(__dirname, `version/${version}`)
    },
    optimization: {
        minimize: true
    }
}
