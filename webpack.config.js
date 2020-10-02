const { ProgressPlugin, HashedModuleIdsPlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const { resolve } = require('path');

const isInteractive = process.stdout.isTTY;
// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;
const useEslintrc = !process.env.NSB_DISABLE_ESLINTRC;

async function build(env) {
    const isDebug = env === 'debug';
    const isDev = !env || env === 'development' || isDebug;
    const config = {
        target: 'node',
        // Un-comment this to debug compiled source in development
        // https://webpack.js.org/configuration/devtool/#devtool
        // devtool: 'inline-cheap-module-source-map',
        mode: isDev ? 'development' : 'production',
        stats: isDev ? 'minimal' : 'normal',
        entry: {
            index: resolve(__dirname, 'src', 'index.js'),
        },
        watch: !!isDev,
        // Stop compilation early in production
        bail: !isDev,
        output: {
            path: resolve(__dirname, 'dist'),
            filename: '[name].js',
        },
        watchOptions: {
            ignored: /node_modules/,
        },
        // https://github.com/webpack/webpack/issues/1599
        // https://codeburst.io/use-webpack-with-dirname-correctly-4cad3b265a92
        node: {
            __dirname: false,
            __filename: false,
        },
        externals: [nodeExternals()],
        module: {
            strictExportPresence: true,
            rules: [
                // Disable require.ensure as it's not a standard language feature.
                { parser: { requireEnsure: false } },
                // Process application JS with Babel.
                // The preset includes JSX, Flow, TypeScript, and some ESnext features.
                {
                    test: /\.m?js$/,
                    include: resolve(__dirname, 'src'),
                    use: {
                        loader: require.resolve('babel-loader'),
                        options: {
                            babelrc: false,
                            configFile: false,
                            // This is a feature of `babel-loader` for webpack (not Babel itself).
                            // It enables caching results in ./node_modules/.cache/babel-loader/
                            // directory for faster rebuilds.
                            cacheDirectory: isDev,
                            cacheCompression: false,
                            compact: !isDev,
                        },
                    },
                },
                // First, run the linter.
                // It's important to do this before Babel processes the JS.
                {
                    test: /\.m?js$/,
                    include: resolve(__dirname, 'src'),
                    use: {
                        loader: require.resolve('eslint-loader'),
                        options: {
                            cache: isDev,
                            failOnError: !isDev,
                            eslintPath: require.resolve('eslint'),
                            ignore: false,
                            useEslintrc,
                        },
                    },
                },
            ],
        },
        plugins: [new CleanWebpackPlugin(), (!isInteractive || !isDev) && new ProgressPlugin()].filter(Boolean),
    };

    if (isDev) {
        config.optimization = {
            ...config.optimization,
            // https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: {
                chunks: 'async',
            },
        };

        if (isDebug) {
            config.devtool = 'cheap-source-map';
        }

        config.plugins.push(
            new NodemonPlugin({
                script: 'dist/index.js',
                watch: ['dist'],
                ignore: ['src', 'node_modules', '*.js.map'],
                verbose: true,
                nodeArgs: isDebug ? process.argv.concat('--inspect=9229') : process.argv,
            }),
        );

        if (isInteractive) {
            config.plugins.push(
                new WebpackBar({
                    name: 'Instagram Clone',
                    color: 'green',
                    profile: writeStatsJson,
                }),
            );
        }
    } else {
        // Enable source map in production
        config.devtool = 'source-map';

        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'async',
                name: false,
            },
            // https://github.com/terser-js/terser
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                    terserOptions: {
                        output: {
                            comments: false,
                        },
                        compress: true,
                        keep_classnames: true, // Required for service logs
                        keep_fnames: true, // Required for service logs
                    },
                }),
            ],
        };

        config.plugins.push(
            // https://github.com/webpack/webpack/issues/959#issuecomment-362926877
            new HashedModuleIdsPlugin(),
        );
    }

    return config;
}

module.exports = build;
