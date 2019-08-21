
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ip = require('ip').address();
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { postcssPlugins } = require('./webpack.utils');
const devMode = process.env.NODE_ENV !== 'production';

const today = new Date();
const Ddigit = _n => _n > 9 ? _n : "0" + _n;
const appVersion = `v${today.getFullYear()}${Ddigit(today.getMonth() + 1)}${Ddigit(today.getDate())}`;

module.exports = {
    // 这里应用程序开始执行

    // webpack 开始打包
    entry: { // string | object | array
        app: [path.resolve(__dirname, 'src/index.js')],
    },

    // webpack 如何输出结果的相关选项
    output: {
        path: path.resolve(__dirname, 'dist'), // 所有输出文件的目标路径 必须是绝对路径（使用 Node.js 的 path 模块）
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[name].[chunkhash].js', //用于长效缓存 内容没有改变时候不会更新hash
        publicPath: "" // 输出解析文件的目录，url 相对于 HTML 页面
    },

    module: {
        // 模块规则（配置 loader、解析器等选项）
        rules: [
            {
                test: /\.json$/,  //用于匹配loaders所处理文件拓展名的正则表达式
                use: 'json-loader', //具体loader的名称
                type: 'javascript/auto',
                exclude: /node_modules/
            },
            // {
            //     test: /\.js$/,
            //     use: [{
            //         loader: 'eslint-loader',
            //         options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
            //             formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
            //         }
            //     }],
            //     enforce: "pre", // 编译前检查
            //     exclude: [/node_modules/], // 不检测的文件
            //     include: [path.resolve(__dirname, 'src')], // 指定检查的目录
            // },
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {// options、query不能和loader数组一起使用
                        cacheDirectory: true// 利用缓存，提高性能，babel is slow
                    },
                }],
                include: path.resolve(__dirname, 'src'),

            },
            {// 编译less
                test: /\.less$/,
                use: [
                    { loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader', // 解释(interpret) @import 和 url() ，会 import/require() 后再解析(resolve)它们
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader', // css预处理器
                        options: {
                            plugins: postcssPlugins.plugins, // 注入css 兼容写法
                            parser: 'postcss-less',
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            },
            {   // 编译scss
                test: /\.scss$/,
                use: [
                    { loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssPlugins.plugins,
                            parser: 'postcss-scss',
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            sourceMap: true,
                            resources: [
                                path.resolve(__dirname, 'src/sass/index.scss'),
                            ]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    { loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssPlugins.plugins,
                            sourceMap: true,
                        }
                    }
                ]
            },
            { // 处理js注入的图片文件（require（'images/logo.png'））,
                // 构建后生成在 dist/images/logo.hash.png , 代码中注入引用路径
                test: /\.(png|jp?g|gif|svg|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,        // 小于8192字节的图片打包成base 64图片
                            name: 'images/[name].[hash:8].[ext]',
                            publicPath: ''
                        }
                    },
                ]
            },
            { // 文件依赖配置项——字体图标
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'fonts/[name].[ext]?[hash:8]',
                        publicPath: ''
                    },
                }],
            },
            { // 文件依赖配置项——视频
                test: /\.(ogg|mpeg4|webm|mp4)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'videos/[name].[ext]?[hash:8]',
                        publicPath: ''
                    },
                }],
            }
        ]
    },

    optimization: {
        // 分割代码  https://www.webpackjs.com/plugins/split-chunks-plugin/
        splitChunks: {
            chunks: "async",  //可选值有：'all'（所有代码块），'async'（按需加载的代码块），'initial'（初始化代码块）。设为‘all’初始块将受其影响（即使是未动态导入的选项）
            minSize: 30000,  //默认值：30000）块的最小大小
            minChunks: 1,  //默认值：1）拆分前共享模块的最小块数
            maxAsyncRequests: 5,  //根据需要加载块时的最大并行请求数将小于或等于5
            maxInitialRequests: 3,  //初始页面加载时的最大并行请求数将小于或等于3
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: { // 缓存组
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10 //设置优先级
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        // 将包含chunks映射关系的list单独从app.js里提取出来
        runtimeChunk: {
            name: 'manifest'
        },
    },

    plugins: [
        //在dist下生成index.html,多个入口会合并在该html以script标签引入
        new HtmlWebpackPlugin({
            filename: 'index.html',// 输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),// 模板文件的路径
            title: 'webpack4-base',// 配置生成页面的标题
            minify: {
                removeRedundantAttributes: true, // 删除多余的属性
                collapseWhitespace: true, // 折叠空白区域
                removeAttributeQuotes: true, // 移除属性的引号
                removeComments: true, // 移除注释
                collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
            },
            version: appVersion
        }),

    ],

    resolve: {
        // 设置可省略文件后缀名
        extensions: [' ', '.js', '.json', '.jsx', '.vue'],
        // 查找 module 的话从这里开始查找;
        modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules")], // 绝对路径;
        // 配置路径映射（别名）
        alias: {
            '@': path.resolve('src'),
        }
    }
}
