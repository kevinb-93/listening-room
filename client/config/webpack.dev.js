const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: './src/app/index.tsx',
    context: path.join(__dirname, '/..'),
    output: {
        path: path.resolve(__dirname, '../src'),
        filename: '[name].js',
        pathinfo: false
    },
    devtool: 'eval-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['css-loader']
            },
            {
                test: /\.(ts|js)x?$/,
                include: path.resolve(__dirname, '../src'),
                loader: 'babel-loader'
            },
            // {
            //     test: /\.tsx?$/,
            //     loader: 'ts-loader',
            //     exclude: /node_modules/,
            //     options: {
            //         transpileOnly: true
            //     }
            // },
            {
                test: /\.(png|jpe?g|gif)$/i,
                include: path.resolve(__dirname, '../src'),
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000
                        }
                    }
                ]
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
    ],
    optimization: {
        runtimeChunk: true,
        removeAvailableModules: false,
        splitChunks: false,
        removeEmptyChunks: false
    }
};
