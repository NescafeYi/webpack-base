const path = require('path');
const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require('./webpack.config.base');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(common, {

    //选择模式告诉webpack相应地使用其内置的优化。
    mode: "development", // "production" | "development" | "none"

    // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
    // 牺牲了构建速度的 `source-map' 是最详细的。
    devtool: 'inline-source-map',

    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 8333, // 本地服务器端口号 
        host: '0.0.0.0',
        stats: {
            all: false,
            errors: true,
            timings: true,
            colors: true
        },
        progress: true,
        compress: true,
        inline:true,
        hot: true, //模块热替换 
        // open: true, //构建完毕自动打开页面
        overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
        historyApiFallback: true,//让所有404的页面定位到index.html
        proxy: {} //配置代理
    },

    plugins: [

        // 热加载插件，需要添加插件的时候不必停止项目运行，会实时更新配置
        new webpack.HotModuleReplacementPlugin(),

        // 展示出打包后的各个bundle所依赖的模块,需要的时候打开，构建时会自动打开
        // new BundleAnalyzerPlugin(),

        // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
        new webpack.NoEmitOnErrorsPlugin(),

    ]
});