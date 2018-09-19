const path = require("path")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const Visualizer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
module.exports = env => {
    const {
        prod = false, local = false, visualize = false
    } = env
    console.info(`webpack env: ${prod ? "production" : "development"}`)
    return {
        mode: prod ? "production" : "development",
        context: path.join(__dirname, "./"),
        entry: {
            app: "./src/index.js",
        },
        output: {
            path: path.resolve(__dirname, "public"),
            publicPath: local ? "./" : "/",
            filename: "[name].bundle.js",
        },
        resolve: {
            extensions: [".js", ".jsx"],
        },
        module: {
            rules: [{
                test: /\.jsx?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            }, {
                test: /\.(png|ico|jpe?g|gif)$/i,
                use: [
                    "file-loader?name=assets/images/[name].[ext]",
                    "image-webpack-loader",
                ],
            }, {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    prod ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader", {
                        loader: "sass-loader",
                        options: {
                            outputStyle: prod ? "compressed" : "expanded",
                            sourceComments: !prod,
                            sourceMap: !prod,
                        },
                    },
                ],
            }, {
                test: /\.(woff|woff2|eot|ttf|svg)$/i,
                loader: "file-loader?name=assets/fonts/[name].[ext]",
            }, ],
        },
        devtool: "source-map",
        devServer: {
            contentBase: path.join(__dirname, "public"),
            compress: true,
            port: 9000,
            open: true,
        },
        plugins: [
            new CleanWebpackPlugin(["public"], {
                verbose: true
            }),
            new CompressionPlugin(),
            new HtmlWebpackPlugin({
                inject: "body",
                template: "./src/index.html",
            }),
            new MiniCssExtractPlugin({
                filename: "assets/styles/[name].css",
                chunkFilename: "[id].css",
            }),
            visualize && new Visualizer(),
        ].filter(_ => _),
    }
}
