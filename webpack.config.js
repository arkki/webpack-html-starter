'use strict';

// Webpack plugins
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

// Custom plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Custom configs
const parts = require('./libs/parts.js');

// Constants
const APP = {
    dir: path.join(__dirname, 'app')
};

const PATHS = {
    app: APP.dir,
    build: path.join(__dirname, 'build'),
    css: path.join(APP.dir, 'css'),
    js: path.join(APP.dir, 'js'),
    image: path.join(APP.dir, 'image'),
    page: path.join(APP.dir, 'page'),
    portfolio: path.join(APP.dir, 'page', 'portfolio')
};

const TEMPLATE = {
    main: `${PATHS.page}/main.html`
};

// Webpack config
const common = {
    entry: {

        // Pages
        index: `${PATHS.app}/index.js`,
        subpage_portfolio: `${PATHS.portfolio}/portfolio/main.js`,
        subpage_projects: `${PATHS.portfolio}/projects/main.js`

    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    plugins: [
        // page
        new HtmlWebpackPlugin({
            template: TEMPLATE.main,
            chunks: ['index'],
            filename: './index.html'
        }),
        new HtmlWebpackPlugin({
            template: TEMPLATE.main,
            chunks: ['subpage_portfolio'],
            filename: './subpage/portfolio.html'
        }),
        new HtmlWebpackPlugin({
            template: TEMPLATE.main,
            chunks: ['subpage_projects'],
            filename: './subpage/projects.html'
        }),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        preLoaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['eslint'],
            include: PATHS.app
        }],
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel?presets[]=es2015'],
            include: PATHS.app
        }, {
            test: /\.html$/,
            loader: 'raw',
            include: PATHS.page
        }]
    }
};

// Extended common configs
let config = merge(
    common,
    parts.setupPostCSS()
);

// Detect how npm is run and branch based on that
switch (process.env.npm_lifecycle_event) {
    case 'build':
        config = merge(
            config, {
                devtool: 'source-map',
                output: {
                    publicPath: '/',
                    path: PATHS.build,
                    filename: '[name].[chunkhash].js',
                    chunkFilename: '[chunkhash].js'
                },
                plugins: [
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.OccurenceOrderPlugin(),
                    new webpack.optimize.AggressiveMergingPlugin()
                ]
            },
            parts.cleanPath(PATHS.build),
            parts.setFreeVariable(
                'process.env.NODE_ENV',
                'production'
            ),
            parts.minify(),
            parts.extractCSS(PATHS.app)
        );

        break;

    default: // Usually used with: npm start
        config = merge(
            config, {
                devtool: 'eval-source-map',
                output: {
                    publicPath: '/'
                }
            },
            parts.devServer({
                host: process.env.HOST,
                port: process.env.PORT
            }),
            parts.setupCSS(PATHS.app)
        );
}

module.exports = validate(config, {
    quiet: true
});
