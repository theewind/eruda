var autoprefixer = require('autoprefixer'),
    classPrefix = require('postcss-class-prefix'),
    webpack = require('webpack'),
    pkg = require('../package.json'),
    path = require('path');

process.traceDeprecation = true; 

var nodeModDir = path.resolve('./node_modules/') + '/',
    banner = pkg.name + ' v' + pkg.version + ' ' + pkg.homepage;

var postcssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins:  [classPrefix('eruda-'), autoprefixer]
    }
};   

module.exports = {
    entry: './src/index',
    devServer: {
        contentBase: './test',
        port: 3000
    },
    output: {
        path: path.resolve(__dirname, '../'),
        publicPath: "/assets/",
        library: ['eruda'],
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /Worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        inline: true,
                        fallback: true,
                        name: '[name].js'
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env'],
                            plugins: ['transform-runtime']
                        }
                    },
                    'eslint-loader'
                ]
            },
            {
                test: /\.scss$/,
                loaders: ['css-loader', postcssLoader, 'sass-loader']
            },
            {
                test: /\.css$/,
                loaders: ['css-loader', postcssLoader]
            },
            // https://github.com/wycats/handlebars.js/issues/1134
            {
                test: /\.hbs$/,
                loader: nodeModDir + 'handlebars-loader/index.js',
                options: {
                    runtime: nodeModDir + 'handlebars/dist/handlebars.runtime.js'
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new webpack.DefinePlugin({
            VERSION: '"' + pkg.version + '"'
        })
    ]
};