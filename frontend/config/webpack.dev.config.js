const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: './src/app/index.tsx',
    /* The output property tells webpack where to emit the bundles it creates
     and how to name these files. */
    output: {
        path: path.resolve(__dirname, 'src'),
        filename: 'bundled.js',
    },
    /* This option controls if and how source maps are generated */
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['css-loader'],
            },
            {
                /* load all .ts and .tsx files through the ts-loader */
                /* load all .ts and .tsx files through the stylint-loader for styled components */
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { plugins: ['react-refresh/babel'] },
                    },
                    {
                        loader: 'ts-loader',
                        options: { transpileOnly: true },
                    },
                    'stylelint-custom-processor-loader',
                ].filter(Boolean),
            },
            {
                // file loader to resolve importing imgs
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    mode: 'development',
    devServer: {
        before: function (app, server) {
            // refresh browser if html file changes
            server._watch('./src/**/*.html');
        },
        open: {
            // open in chrome browser (guest mode)
            app: ['Chrome'],
        },
        contentBase: path.join(__dirname, 'src'),
        historyApiFallback: true,
        hot: true,
        compress: true,
        port: 3000,
    },
    plugins: [
        new ReactRefreshWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        /* The HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles. */
        new HtmlWebpackPlugin({
            template: 'src/app/index.html',
        }),
    ],
};
