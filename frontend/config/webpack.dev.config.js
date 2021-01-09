const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: './src/app/index.tsx',
    context: path.join(__dirname, '/..'),
    /* how to emit the bundles */
    output: {
        path: path.resolve(__dirname, 'src'),
        filename: 'bundled.js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['css-loader']
            },
            {
                /* babel-loader for hot module replacement */
                /* ts-loader for typescript */
                /* stylint-loader for styled components */
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { plugins: ['react-refresh/babel'] }
                    },
                    {
                        loader: 'ts-loader',
                        options: { transpileOnly: true }
                    },
                    'stylelint-custom-processor-loader'
                ].filter(Boolean)
            },
            {
                // file loader for imgs
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                // url loader for fonts
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    mode: 'development',
    devServer: {
        before: function (app, server) {
            // refresh browser if html file changes
            server._watch('./src/**/*.html');
        },
        contentBase: path.join(__dirname, 'src'),
        historyApiFallback: true,
        hot: true,
        compress: true,
        port: 3000
    },
    plugins: [
        /* React hot module replacement */
        new ReactRefreshWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        /* simplifies creation of HTML */
        new HtmlWebpackPlugin({
            template: 'src/app/index.html'
        })
    ]
};
