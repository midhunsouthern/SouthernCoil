
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = ({ mode } = { mode: "production" }) => {
    console.log(`mode is: ${mode}`);

    return {
            resolve: {
                fallback: {
                    "fs": false,
                    "tls": false,
                    "net": false,
                    "path": false,
                    "zlib": false,
                    "http": false,
                    "https": false,
                    "stream": false,
                    "crypto": false,
                    "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
                  },
            },
            mode,
            entry: "./src/index.js",
            output: {
                publicPath: "/",
                path: path.resolve(__dirname, "build"),
                filename: "bundled.js"
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: "./public/index.html"
                }),
            ]
        }
};