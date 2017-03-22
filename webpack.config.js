var debug = process.env.NODE_ENV === "debug" || !process.env.NODE_ENV;
var prod = process.env.NODE_ENV === "prod";
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),
  devtool: prod ? null : "inline-sourcemap",
  entry: {
    attendee: "attendee.client",
    organizer: "organizer.client",
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: "[name]/[name].client.min.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(__dirname, "./src/js")
  },
  plugins: debug ? [] : [
    new ExtractTextPlugin('dist/styles/main.css', { allChunks: true }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        booleans: true,
        conditionals: true,
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        evaluate: true,
        sequences: true,
        unused: true,
        warnings: false,
      },
      mangle: false,
      sourcemap: !prod,
    }),
  ],
};
