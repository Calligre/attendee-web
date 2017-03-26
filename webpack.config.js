var prod = process.env.NODE_ENV === "production";
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
  externals: {
    'auth0-lock': 'Auth0Lock',
    'jquery': 'jQuery',
    'react': 'React',
    'react-bootstrap': 'ReactBootstrap',
    'react-bootstrap-table': 'ReactBootstrapTable',
    'react-dom': 'ReactDOM'
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
      },
	  {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?sourceMap&sourceComments',
        ],
      },
    ]
  },
  postcss: () => {
    return [
      /* eslint-disable global-require */
      require('postcss-cssnext'),
      /* eslint-enable global-require */
    ];
  },
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: "[name]/[name].client.min.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(__dirname, "./src/js")
  },
  plugins: prod ? [
    new ExtractTextPlugin('dist/styles/main.css', { allChunks: true }),
    new webpack.optimize.AggressiveMergingPlugin({ minSizeReduce: 1.1 }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
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
      sourceMap: false,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ] : [],
};
