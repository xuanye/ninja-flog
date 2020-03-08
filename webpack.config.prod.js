const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    mode: 'production',
    output: { publicPath: './' },
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
        new BundleAnalyzerPlugin(),
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
            template: './index.html',
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
