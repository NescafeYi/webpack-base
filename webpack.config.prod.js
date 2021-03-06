const path = require("path");
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { postcssPlugins } = require('./webpack.utils');


var webpackConfigProd = merge(common, {

    //选择模式告诉webpack相应地使用其内置的优化。
    mode: "production", // "production" | "development" | "none"

    // 不设加快构建速度，同时不会生成source map，需要调试线上的打包时打开
    // devtool: 'eval-source-map',  

    module: {
        rules: [{ // 压缩图片文件
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [{
                loader: 'image-webpack-loader',
                options: {
                    optipng: {
                        optimizationLevel: 7
                    },
                    gifsicle: {
                        interlaced: false
                    },
                    pngquant: {
                        quality: '65-90',
                        speed: 4
                    },
                    mozjpeg: {
                        quality: 65,
                        progressive: true
                    }
                }
            }]
        }]
    },

    plugins: [
        // 在构建之前把dist清空
        new CleanWebpackPlugin(),

        // 对js文件进行压缩，从而减小js文件的大小，加速load速度。
        new UglifyJSPlugin(),

        new copyWebpackPlugin([
            {
                from:path.resolve(__dirname+'/static'),// 打包的静态资源目录地址
                to:'./static' // 打包到dist下面的static
            },
            {
                from:path.resolve(__dirname+'/README'),// 打包的静态资源目录地址
                to:'./README' // 打包到dist下面的README
            },
        ]),

        // 抽离注入在js的css代码，构建后生成 dist/css 下，线上环境最好抽离css，避免产生运行错误
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[name].[contenthash].css"
        }),
    ]
});

module.exports = webpackConfigProd;