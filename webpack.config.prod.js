const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, './src/index.js'), // 入口文件
    output: {
        filename: '[name].[hash:8].js', // 打包后的文件名称
        path: path.resolve(__dirname, './dist'), // 打包后的目录
        publicPath: './',
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        //new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new CopyWebpackPlugin([
            {
                from: './src/assets',
                to: './assets',
            },
        ]),
        new HTMLWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            hash: true,
            minify: false,
        }),
        new WebpackCdnPlugin({
            modules: [
                {
                    name: 'pixi.js',
                    var: 'PIXI',
                    path: 'dist/pixi.min.js',
                },
                {
                    name: 'animejs',
                    var: 'anime',
                    path: 'lib/anime.min.js',
                },
            ],
            publicPath: '/node_modules',
        }),
    ],
};
