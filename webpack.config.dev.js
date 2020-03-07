const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports = {
    mode: 'development',
    devServer: {
        contentBase: 'dist',
        port: 3000,
    },
    devtool: 'inline-source-map',
    plugins: [
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
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
        }),
    ],
};
