const webpack = require('webpack');

exports.devServer = function devServer(options) {
    return {
        devServer: {
            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,

            // Unlike the cli flag, this doesn't set
            // HotModuleReplacementPlugin!
            hot: true,
            inline: true,

            // Display only errors to reduce the amount of output.
            // stats: 'errors-only',

            // Parse host and port from env to allow customization.
            //
            // If you use Vagrant or Cloud9, set
            // host: options.host || '0.0.0.0';
            //
            // 0.0.0.0 is available to all network devices
            // unlike default `localhost`.
            host: options.host, // Defaults to `localhost`
            port: options.port // Defaults to 8080
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    };
};

exports.minify = function minify() {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                comments: false,
                mangle: {
                    // Don't mangle $ and other stuff
                    except: ['webpackJsonp', '$super', '$', 'exports', 'require'],

                    // Don't care about IE8
                    screw_ie8: true,

                    // Don't mangle function names
                    keep_fnames: true
                },
                sourcemap: false,
                compress: {
                    warnings: false,

                    // FIXME: Change to true
                    drop_console: false
                }
            })
        ]
    };
};

exports.setFreeVariable = function setFreeVariable(key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    };
};

/*
 * Can be used for extracting vendor plugins as separate JS files. Usage:
 *  parts.extractBundle({
 *     name: 'vendor',
 *     entries: ['jquery']
 *  }),
 *
 */
exports.extractBundle = function extractBundle(options) {
    const entry = {};
    entry[options.name] = options.entries;

    return {
        // Define an entry point needed for splitting.
        entry,
        plugins: [
            // Extract bundle and manifest files. Manifest is
            // needed for reliable caching.
            new webpack.optimize.CommonsChunkPlugin({
                names: [options.name, 'manifest']
            })
        ]
    };
};


const CleanWebpackPlugin = require('clean-webpack-plugin');

exports.cleanPath = function cleanPath(path) {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                // Without `root` CleanWebpackPlugin won't point to our
                // project and will fail to work.
                root: process.cwd()
            })
        ]
    };
};

// FIXME: uncomment for prod
// const stylelint = require('stylelint');
const autoprefixer = require('autoprefixer');

exports.setupPostCSS = function setupPostCSS() {
    return {
        postcss: function postcss() {
            return [
                // FIXME: uncomment for prod
                // stylelint(),
                autoprefixer({
                    browsers: ['last 3 versions', '> 1%']
                })
            ];
        }
    };
};

exports.setupCSS = function setupCSS(paths) {
    return {
        module: {
            loaders: [{
                test: /\.scss$/,
                loaders: ['style', 'css', 'postcss', 'sass'],
                include: paths
            }, {
                test: /\.css$/,
                loaders: ['style', 'css', 'postcss'],
                include: paths
            }]
        }
    };
};


const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.extractCSS = function extractCSS(paths) {
    return {
        module: {
            loaders: [
                // Extract CSS during build
                {
                    test: /\.s(a|c)ss$/,
                    loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
                    include: paths
                }, {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css!postcss'),
                    include: paths
                }
            ]
        },
        plugins: [
            // Output extracted CSS to a file
            new ExtractTextPlugin('[name].[chunkhash].css')
            // new ExtractTextPlugin('style.css')
        ]
    };
};

/*
 * Can be used for removing unused CSS.
 */
const PurifyCSSPlugin = require('purifycss-webpack-plugin');

exports.purifyCSS = function purifyCSS(paths) {
    return {
        plugins: [
            new PurifyCSSPlugin({
                basePath: process.cwd(),
                // `paths` is used to point PurifyCSS to files not
                // visible to Webpack. You can pass glob patterns
                // to it.
                paths
            })
        ]
    };
};
