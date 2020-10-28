const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
                /* load all .ts and .tsx files through the ts-loader */
                /* load all .ts and .tsx files through the stylint-loader for styled components */
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: ['ts-loader', 'stylelint-custom-processor-loader'],
            },
            {
                // file loader to resolve importing files
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
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
        port: 3000,
    },
    plugins: [
        /* The HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles. */
        new HtmlWebpackPlugin({
            template: 'src/app/index.html',
        }),
    ],
};
