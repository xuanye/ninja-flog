const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

module.exports = {
    mode: 'development',
    devServer: {
        contentBase: 'dist',
        host: '0.0.0.0',
        hot: true,
        port: 3000,
    },
    devtool: 'inline-source-map',
    plugins: [
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),
        new ProvidePlugin({
            PIXI: 'pixi.js',
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
        }),
    ],
};
