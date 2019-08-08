
const path = require('path');
const Autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    // 这里应用程序开始执行

    // webpack 开始打包
    entry: './app/index.js', // string | object | array

    // webpack 如何输出结果的相关选项
    output: {
        path: path.resolve(__dirname, 'dist'),    // 所有输出文件的目标路径 必须是绝对路径（使用 Node.js 的 path 模块）
        filename: '[name].[chunkhash:8].chunk.js',   //用于长效缓存 内容没有改变时候不会更新hash
        publicPath: '.', // 输出解析文件的目录，url 相对于 HTML 页面
    },

    module: {
        // 模块规则（配置 loader、解析器等选项）
        rules: [ 
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: ['/node_modules'],
                loader: 'babel-loader', // js 代码解析器
                options: {
                    presets: [
                        [ // 根据运行目标注入polyfill
                            "@babel/preset-env",
                            // {
                            //   "useBuiltIns": "usage", // 可以在运行时候注入引用的api对应的polyfill
                            //   "corejs":3, // 对应使用corejs库版本
                            //   "debug": true, // 打印出注入与目标识别的log
                            // }
                        ],
                        // "@babel/preset-react"
                    ],
                    // plugins: [
                    //     // 解析类的属性,如es7修饰器
                    //     ["@babel/plugin-proposal-decorators", { "legacy": true }],
                    //     "transform-class-properties", // 解决 es6 中使用class声明中 ：defaultProps={} 不支持的问题
                    //     "@babel/plugin-syntax-dynamic-import", // 支持import() 动态引入
                    //     "@babel/plugin-transform-react-jsx" // 转化jsx语法
                    // ],
                    compact: true,
                    cacheDirectory: true
                }
            },
            {
                test: /\.less$/,
                exclude: ['/node_modules'],
                use: [
                    // 生产模式，抽离注入在js的less代码
                    // devMode ? 'style-loader' :
                    //     {
                    //         loader: MiniCssExtractPlugin.loader,
                    //         options: {
                    //             publicPath: '../'
                    //         }
                    //     },
                    'css-loader', // 解释(interpret) @import 和 url() ，会 import/require() 后再解析(resolve)它们
                    { // css预处理器
                        loader: 'postcss-loader',
                        options: { plugins: [Autoprefixer] } // 注入css 兼容写法
                    },
                    'less-loader', // less 代码转化
                ],
            },
            {
                test: /\.css$/,
                exclude: ['/node_modules'],
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            { // 处理js注入的图片文件（require（'assets/logo.png'））,
                // 构建后生成在 dist/assets/logo.hash.png , 代码中注入引用路径
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: ['/node_modules'],
                loader: 'file-loader',
                options: {
                    limit: 8192,
                    name: '[name].[hash:8].[ext]',
                    publicPath: 'assets',
                }
            },
            { // 同上
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: ['/node_modules'],
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    prefix: 'fonts',
                    name: '[name].[hash:8].[ext]',
                    mimetype: 'application/font-woff',
                    publicPath: 'assets',
                }
                // use: 'url-loader??prefix=fonts/name=assets/[name].[hash:8].[ext]&limit=10000&mimetype=application/font-woff'
            },
            { // 同上
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: ['/node_modules'],
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    prefix: 'fonts',
                    name: '[name].[hash:8].[ext]',
                    mimetype: 'font/opentype',
                    publicPath: 'assets',
                }
                // use: 'file-loader?prefix=fonts/&name=assets/[name].[hash:8].[ext]&limit=10000&mimetype=font/opentype'
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
        }
    },

    plugins: [
        //在dist下生成index.html,多个入口会合并在该html以script标签引入
        new HtmlWebpackPlugin(),
        // 抽离注入在js的css代码，构建后生成 dist/css 下，线上环境最好抽离css，避免产生运行错误
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[name].[contenthash:8].css"
        }),
    ]
}
