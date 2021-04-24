const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: './src/app/index.tsx',
    context: path.join(__dirname, '/..'),
    output: {
        path: path.resolve(__dirname, '../src'),
        filename: 'bundled.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['css-loader']
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    mode: 'development',
    devServer: {
        before: function (app, server) {
            server._watch('./src/**/*.html');
        },
        contentBase: path.join(__dirname, '/../src'),
        historyApiFallback: true,
        hot: true,
        compress: true,
        port: 3000
    },
    plugins: [
        new ReactRefreshWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true
                },
                mode: 'write-references'
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/app/index.html'
        })
    ]
};
