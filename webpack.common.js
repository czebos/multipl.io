const path = require('path');

const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/client/html/index.html",
  filename: "./index.html"
});

module.exports = {
    entry: {
        game: './src/client/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      alias: {
          jquery: "jquery/src/jquery"
      }
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
        ]
    }
}