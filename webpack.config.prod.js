const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {

    //选择模式告诉webpack相应地使用其内置的优化。
    mode: "production", // "production" | "development" | "none"

    // 不设加快构建速度，同时不会生成source map，需要调试线上的打包时打开
    // devtool: 'eval-source-map',  

    plugins: [
        // 在构建之前把dist清空
        new CleanWebpackPlugin(),
        // 对js文件进行压缩，从而减小js文件的大小，加速load速度。
        new UglifyJSPlugin(),
    ]
});